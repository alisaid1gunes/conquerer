import { Service } from 'typedi';
import * as bcrypt from 'bcrypt';
import {UserRepository} from "../../users/repositories/UserRepository";
import {JwtService} from "./JwtService";
import {User} from "../../users/entities/User";
import {RegisterDto} from "../dto/RegisterDto";
import {LoginDto} from "../dto/LoginDto";
import {ChangePasswordDto} from "../dto/ChangePasswordDto";
import {RefreshTokenDto} from "../dto/RefreshTokenDto";
import {RedisService} from "../../shared/RedisService";

@Service()
export class AuthService {
    constructor(private userRepository: UserRepository, private jwtService: JwtService, private redisService: RedisService) {}


    async registerUser(registerDto: RegisterDto): Promise<User> {
        const { fullName, password, email } = registerDto;

        const isEmailUsed = await this.userRepository.findOne({where: {email}});
        if(isEmailUsed){
            throw new Error('email already registered');
        }

        const username= await this.turkishToEnglish(fullName)

        if (!this.isPasswordValid(password)) {
            throw new Error('Password must contain at least one special character');
        }
        const isUsernameUsed = await this.userRepository.findOne({where: {username}});
        if(isUsernameUsed){
            throw new Error('username already taken')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User();
        newUser.fullName = fullName;
        newUser.username = username;
        newUser.email = email;
        newUser.password = hashedPassword;
        return await this.userRepository.save(newUser);
    }

    async loginUser(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
        const { username, password } = loginDto;

        const user = await this.userRepository.findOne({where: {username}});
        if (!user) {
            throw new Error('Invalid username or password');
        }


        const isPasswordValid = await this.validatePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }

       await this.redisService.deleteKey(user.id.toString());


        const accessToken = this.jwtService.generateAccessToken(user);
        const refreshToken = this.jwtService.generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await this.userRepository.update(user.id, { refreshToken });

        const userId = user.id.toString();
        await this.redisService.setValue(userId, accessToken,900);

        return { accessToken, refreshToken };
    }


    private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }

    private isPasswordValid(password: string): boolean {
        const specialCharacters = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
        return specialCharacters.test(password);
    }


    async logoutUser(user: User): Promise<void> {
         user.refreshToken = null;
         await this.userRepository.update(user.id, user);
         await this.redisService.deleteKey(user.id.toString());

        
    }


    async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<void> {
        const { oldPassword, newPassword } = changePasswordDto;


        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid old password');
        }

        if (!this.isPasswordValid(newPassword)) {
            throw new Error('Password must contain at least one special character');
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);


        await this.userRepository.update(user.id, { password: hashedPassword, refreshToken: null });

        await this.redisService.deleteKey(user.id.toString());
    }



    async deleteUser(user: User): Promise<void> {
        const userId = user.id
        await this.userRepository.remove(user);
        await this.redisService.deleteKey(userId.toString());
    }

    async refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
        const { refreshToken } = refreshTokenDto;

        const decodedToken = this.jwtService.verifyRefreshToken(refreshToken);
        const userId = decodedToken.userId;

        const user = await this.userRepository.findOne({ where: {id:userId}});

        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }

        await this.redisService.deleteKey(user.id.toString());

        const accessToken = this.jwtService.generateAccessToken(user);
        await this.redisService.setValue(userId, accessToken,900);
        return { accessToken };
    }

   private async  turkishToEnglish(text: string) {
        const turkishLetters = 'çÇğĞıİöÖşŞüÜ';
        const englishLetters = 'cCgGiIoOsSuU';

        for (let i = 0; i < turkishLetters.length; i++) {
            const regex = new RegExp(turkishLetters.charAt(i), 'g');
            text = text.replace(regex, englishLetters.charAt(i));
            text = text.replace(/\s+/g, '');
        }

        return text.toLowerCase();
    }
}
