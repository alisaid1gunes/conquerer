import { createConnection, getRepository } from 'typeorm';
import { User } from './users/entities/User';
import { UserRepository } from './users/repositories/UserRepository';
import { Container } from 'typedi';
import config from './config/config';

export const createDatabaseConnection = async () => {
    const connection = await createConnection({
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.database,
        entities: [User],
        synchronize: true, // Set to false in production
    });

    const userRepository = getRepository(User);
    Container.set(UserRepository, userRepository);

    console.log('Connected to the database');

};
