import {ExpressMiddlewareInterface} from 'routing-controllers';
import {Request, Response, NextFunction} from 'express';
import {verify} from 'jsonwebtoken';
import {Container, Service} from 'typedi';
import {UserService} from '../users/services/UserService';
import {User} from "../users/entities/User";
import config from "../config/config";
import {RedisService} from "../shared/RedisService";

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
    async use(request: Request, response: Response, next: NextFunction): Promise<void> {

        const token = (request.headers.authorization as string)?.replace('Bearer ', '');

        if (!token) {
            response.status(401).json({message: 'Unauthorized', success:false});
            return;
        }

        try {
            const decodedToken: any = verify(token, config.jwt.accessTokenSecret);
            const userService = Container.get(UserService);
            const user = await userService.getUserById(decodedToken.userId);


            if (!user) {
                response.status(401).json({message: 'Unauthorized', success:false});
                return;
            }

            const redisService = Container.get(RedisService);
            const storedToken = await redisService.getValue(user.id.toString());


            if (storedToken !== token) {
                response.status(401).json({message: 'Unauthorized', success:false});
                return;
            }

            request.user = user;
            next();
        } catch (error) {
            response.status(401).json({message: 'Unauthorized', success:false});
        }
    }
}
