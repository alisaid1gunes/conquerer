import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { Blog } from '../entities/Blog';

@Service()
export class BlogRepository extends Repository<Blog> {}
