import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';
import Chance from 'chance';
import bcrypt from 'bcrypt';
import { Comment } from './src/comments/entities/Comment';
import { User } from './src/users/entities/User';
import { Category } from './src/categories/entities/Category';
import { Blog } from './src/blogs/entities/Blog';
import config from './src/config/config';

const chance = new Chance();

const NUM_USERS = 10;
const BLOGS_PER_USER = 10;

async function seed() {
  try {
    const connectionOptions: ConnectionOptions = {
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [User, Category, Blog, Comment],
      synchronize: true,
    };

    const connection = await createConnection(connectionOptions);

    // Seed users
    const uniqueUsernames = chance.unique(chance.word, NUM_USERS);
    const users: User[] = [];
    for (let i = 0; i < NUM_USERS; i++) {
      const user = new User();
      user.fullName = chance.name();
      user.username = uniqueUsernames[i];
      user.email = chance.email();
      const password = chance.string({
        length: 8,
        symbols: true,
      });
      user.password = await bcrypt.hash(password, 10);
      await connection.manager.save(user);
      users.push(user);
    }

    const categories: Category[] = await connection.manager.find(Category);

    for (const user of users) {
      for (let i = 0; i < BLOGS_PER_USER; i++) {
        const blog = new Blog();
        blog.title = chance.sentence({ words: 5 });
        blog.content = chance.paragraph();
        blog.author = user;
        blog.category = chance.pickone(categories);
        await connection.manager.save(blog);

        for (const otherUser of users.filter((u) => u !== user)) {
          const comment = new Comment();
          comment.content = chance.sentence({ words: 10 });
          comment.user = otherUser;
          comment.blog = blog;
          await connection.manager.save(comment);
        }
      }
    }

    await connection.close();

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error in seed:', error);
  }
}

seed();
