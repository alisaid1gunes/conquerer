import {
    JsonController,
    Get,
    Authorized,
    UseBefore,
    Patch,
    Res,
    Body,
    HttpError,
    CurrentUser, HttpCode
} from 'routing-controllers';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';
import {Service} from "typedi";
import {AuthMiddleware} from "../../middlewares/AuthMiddleware";
import {Response} from "express";
import {LoginDto} from "../../auth/dto/LoginDto";
import {ApiResponseType} from "../../shared/ApiResponseType";
import {UserProfileDto} from "../dto/UserProfileDto";
import {UserUpdateProfileDto} from "../dto/UserUpdateProfileDto";

@JsonController('/users')
@UseBefore(AuthMiddleware)
@Service()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    @HttpCode(200)
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Get('/me')
    @HttpCode(200)
    async me(
        @Res() response: Response,
        @CurrentUser() user: User,
    ): Promise<ApiResponseType> {
        try {

            const userProfile = new UserProfileDto()

            userProfile.fullName = user.fullName;
            userProfile.username = user.username;
            if (user.birthDate) userProfile.birthDate = user.birthDate;

            const apiResponse: ApiResponseType = {
                success: true,
                message: 'User profile successfully retrieved',
                data: userProfile
            };
            return apiResponse
        } catch (error: any) {
            throw new HttpError(400,error.message)
        }
    }

    @Patch('/me')
    @HttpCode(200)
    async updateMe(
        @Res() response: Response,
        @Body() updateDto: UserUpdateProfileDto,
        @CurrentUser() user: User,

    ): Promise<ApiResponseType> {
        try {

           const result = await this.userService.updateProfile(user.id, updateDto)

            const apiResponse: ApiResponseType = {
                success: true,
                message: 'User profile successfully updated',
                data: result
            };
            return apiResponse
        } catch (error: any) {
            throw new HttpError(400,error.message)
        }
    }

}

