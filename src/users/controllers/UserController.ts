import {JsonController, Get, Authorized, UseBefore} from 'routing-controllers';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';
import {Service} from "typedi";
import {AuthMiddleware} from "../../middlewares/AuthMiddleware";

@JsonController('/users')
@Service()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    @UseBefore(AuthMiddleware)
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    // Diğer endpointler...
}

