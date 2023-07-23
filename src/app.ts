import 'reflect-metadata';
import express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { createDatabaseConnection } from './connection';
import { UserController } from './users/controllers/UserController';
import { AuthController } from './auth/controllers/AuthController';
import { currentUserChecker } from './middlewares/currenUserChecker';
import ErrorMiddleware from './middlewares/ErrorMiddleware';
import ResponseMiddleware from './middlewares/ResponseMiddleware';
import { createCategories } from './categoryInit';
import { BlogController } from './blogs/controllers/BlogController';
import { CommentController } from './comments/controllers/CommentController';
import { ElasticController } from './elastic/controllers/ElasticController';
import compression from 'compression';
import helmet from 'helmet';
async function startApp() {
  await createDatabaseConnection();

  const container = Container.of(undefined);

  useContainer(container);

  const app = express();

  app.use(helmet());
  app.use(
    compression({
      threshold: 0,
    }),
  );
  useExpressServer(app, {
    controllers: [AuthController, UserController, BlogController, CommentController, ElasticController],
    currentUserChecker: currentUserChecker,
    middlewares: [ErrorMiddleware],
    interceptors: [ResponseMiddleware],
    defaultErrorHandler: false,
  });

  app.listen(3000, async () => {
    console.log('Server running on http://localhost:3000');
    await createCategories();
  });
}

startApp();
