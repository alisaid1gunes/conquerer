import {
    JsonController,
    Post,
    Body,
    CurrentUser,
    Put,
    Delete,
    HttpCode,
    UseBefore,
    Res,
    HttpError,
} from 'routing-controllers';
import { RegisterDto } from '../dto/RegisterDto';
import { LoginDto } from '../dto/LoginDto';
import { ChangePasswordDto } from '../dto/ChangePasswordDto';
import { RefreshTokenDto } from '../dto/RefreshTokenDto';
import { User } from '../../users/entities/User';
import {AuthService} from "../services/AuthServices";
import {Service} from "typedi";
import {AuthMiddleware} from "../../middlewares/AuthMiddleware";
import { Response } from 'express';
import {ApiResponseType} from "../../shared/ApiResponseType";



@JsonController('/auth')
@Service()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    @HttpCode(201)
    async register(
        @Res() response: Response,
        @Body() registerDto: RegisterDto,
    ): Promise<ApiResponseType> {
        try {
            const user = await this.authService.registerUser(registerDto);

            const apiResponse: ApiResponseType = {
                success: true,
                message: 'User registered successfully',
                data: user
            };
            return apiResponse
        } catch (error: any) {

           throw new HttpError(400,error.message)
        }
    }

    @Post('/login')
    @HttpCode(200)
    async login(
        @Res() response: Response,
        @Body() loginDto: LoginDto
    ): Promise<ApiResponseType> {
        try {
            const { accessToken, refreshToken } = await this.authService.loginUser(loginDto);
            const apiResponse: ApiResponseType = {
                success: true,
                message: 'User logged in successfully',
                data: { accessToken, refreshToken }
            };
            return apiResponse
        } catch (error: any) {

            throw new HttpError(400,error.message)
        }
    }

    @HttpCode(200)
    @Post('/logout')
    @UseBefore(AuthMiddleware)
    async logout(
        @Res() response: Response,
        @CurrentUser() user: User
    ): Promise<ApiResponseType> {
        try {
            await this.authService.logoutUser(user);
            const apiResponse: ApiResponseType = {
                success: true,
                message: 'User logged out successfully'
            };
            return apiResponse
        } catch (error: any) {
            throw new HttpError(400,error.message)
        }
    }

    @Put('/change-password')
    @HttpCode(200)
    @UseBefore(AuthMiddleware)
    async changePassword(
        @Res() response: Response,
        @CurrentUser() user: User,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<ApiResponseType> {
        try {
            await this.authService.changePassword(user, changePasswordDto);
            const apiResponse: ApiResponseType = {
                success: true,
                message: 'Password changed successfully'
            };
            return apiResponse
        } catch (error: any) {
            const apiResponse: ApiResponseType = {
                success: false,
                message: 'Password change failed',
                error: error.message
            };
            throw new HttpError(400,error.message)
        }
    }

    @Delete('/delete-account')
    @HttpCode(200)
    @UseBefore(AuthMiddleware)
    async deleteAccount(
        @CurrentUser() user: User
    ): Promise<ApiResponseType> {
        try {
            await this.authService.deleteUser(user);
            const apiResponse: ApiResponseType = {
                success: true,
                message: 'User account deleted successfully'
            };
            return apiResponse;
        } catch (error: any) {
            throw new HttpError(400,error.message)
        }
    }

    @Post('/refresh-token')
    @HttpCode(200)
    async refreshAccessToken(
        @Res() response: Response,
        @Body() refreshTokenDto: RefreshTokenDto
    ): Promise<ApiResponseType> {
        try {
            const { accessToken } = await this.authService.refreshAccessToken(refreshTokenDto);
            const apiResponse: ApiResponseType = {
                success: true,
                message: 'Access token refreshed successfully',
                data: { accessToken }
            };
            return apiResponse
        } catch (error: any) {
            throw new HttpError(400,error.message)
        }
    }
}