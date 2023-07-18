import 'reflect-metadata';
import express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { createDatabaseConnection } from './connection';
import { UserController } from './users/controllers/UserController';
import { AuthController } from './auth/controllers/AuthController'
import {currentUserChecker} from "./middlewares/currenUserChecker";

import {AuthMiddleware} from "./middlewares/AuthMiddleware";
import {errorHandler} from "ioredis/built/redis/event_handler";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import ResponseMiddleware from "./middlewares/ResponseMiddleware";



async function startApp() {
    // Create the database connection
    await createDatabaseConnection();

    // Set up TypeDI container
    const container = Container.of(undefined);


    // Enable TypeDI container for routing-controllers
    useContainer(container);

    // Set up routing-controllers with the dependency injection container
    const app = express();

    useExpressServer(app, {
        controllers: [AuthController,UserController],
        currentUserChecker: currentUserChecker,
        middlewares: [ErrorMiddleware],
        interceptors: [ResponseMiddleware],
        defaultErrorHandler: false,
    });



    // Start the server
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}

startApp();
