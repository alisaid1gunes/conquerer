import {Service} from 'typedi';
import {UserRepository} from '../repositories/UserRepository';
import {User} from '../entities/User';
import {UserUpdateProfileDto} from "../dto/UserUpdateProfileDto";

@Service()
export class UserService {
    constructor(private userRepository: UserRepository) {
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(id: number): Promise<User> {

        const user = await this.userRepository.findOne({where: {id}});

        if (!user) throw new Error('User not found');

        return user;

    }

    async updateProfile(id: number, updateDto: UserUpdateProfileDto): Promise<boolean> {
        if (updateDto.username) {
            const hasUser: User | null = await this.userRepository.findOne({where: {username: updateDto.username}})
            if (hasUser) throw new Error('Username already taken');
        }
        const result = await this.userRepository.update(id, updateDto);
        if (!result) throw new Error('Could not update profile')

        return true;
    }
}
