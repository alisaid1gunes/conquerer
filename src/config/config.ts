import { config as dotenvConfig } from 'dotenv';

interface Server {
  port: number;
}

interface JWTConfig {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
}

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

interface Config {
  server: Server;
  jwt: JWTConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
}

// Load environment variables from .env file
dotenvConfig();

const config: Config = {
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'accessTokenSecret',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refreshTokenSecret',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '1h',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'your_default_username',
    password: process.env.DB_PASSWORD || 'your_default_password',
    database: process.env.DB_DATABASE || 'your_default_database',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || 'your_password',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
};

export default config;
