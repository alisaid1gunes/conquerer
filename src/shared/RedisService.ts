// RedisService.ts
import { Service } from 'typedi';
import Redis, { Redis as RedisClient } from 'ioredis';
import config from '../config/config';

@Service()
export class RedisService {
    private readonly redis: RedisClient;
    constructor() {
        this.redis = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
        });
    }

    async getValue(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }

    async setValue(key: string, value: string, duration?: number): Promise<string> {
        if (duration) {
            return await this.redis.set(key, value, 'EX', duration);
        } else {
            return await this.redis.set(key, value);
        }
    }

    async deleteKey(key: string): Promise<number> {
        return await this.redis.del(key);
    }
}
