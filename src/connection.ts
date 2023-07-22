import { createConnection, getRepository } from 'typeorm';
import { User } from './users/entities/User';
import { UserRepository } from './users/repositories/UserRepository';
import { Container } from 'typedi';
import config from './config/config';
import { Category } from './categories/entities/Category';
import { CategoryRepository } from './categories/repositories/CategoryRepository';
import { Blog } from './blogs/entities/Blog';
import { Comment } from './comments/entities/Comment';
import { BlogRepository } from './blogs/repositories/BlogRepository';
import { CommentRepository } from './comments/repositories/CommentRepository';

export const createDatabaseConnection = async () => {
  const connection = await createConnection({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    entities: [User, Category, Blog, Comment],
    synchronize: true, // Set to false in production
  });

  const userRepository = getRepository(User);
  const categoryRepository = getRepository(Category);
  const blogRepository = getRepository(Blog);
  const commentRepository = getRepository(Comment);
  Container.set(UserRepository, userRepository);
  Container.set(CategoryRepository, categoryRepository);
  Container.set(BlogRepository, blogRepository);
  Container.set(CommentRepository, commentRepository);
  console.log('Connected to the database');
};
