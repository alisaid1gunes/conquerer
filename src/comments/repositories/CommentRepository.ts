import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { Comment } from '../entities/Comment';

@Service()
export class CommentRepository extends Repository<Comment> {}
