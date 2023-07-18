import { Service} from 'typedi';
import * as jwt from 'jsonwebtoken';
import { User } from '../../users/entities/User';
import config from "../../config/config";

@Service()
export class JwtService {


    generateAccessToken(user: User): string {
        const payload = { userId: user.id };
        const options = { expiresIn: config.jwt.accessTokenExpiresIn };
        return jwt.sign(payload, config.jwt.accessTokenSecret, options);
    }

    generateRefreshToken(user: User): string {
        return jwt.sign({ userId: user.id }, config.jwt.refreshTokenSecret, { expiresIn: config.jwt.refreshTokenExpiresIn });
    }

    verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, config.jwt.refreshTokenSecret);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
