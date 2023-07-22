import { Service } from 'typedi';
import { Pagination } from '../../shared/pagination';
import { User } from '../../users/entities/User';
import { CommentRepository } from '../repositories/CommentRepository';
import { Comment } from '../entities/Comment';
import { CreateCommentDto } from '../dto/CreateCommentDto';
import { BlogService } from '../../blogs/services/BlogService';
@Service()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly blogService: BlogService,
  ) {}

  async createComment(user: User, createCommentDto: CreateCommentDto): Promise<boolean> {
    const { content, blogId } = createCommentDto;

    const comment: Comment = new Comment();
    const blog = await this.blogService.getBlogDefault(blogId);

    if (!blog) throw new Error('Blog not found');

    comment.blog = blog;
    comment.content = content;
    comment.user = user;

    const result = await this.commentRepository.save(comment);

    if (!result) throw new Error('Comment is not created');
    return true;
  }

  async getMyComments(user: User, pagination: Pagination): Promise<Comment[]> {
    const offset = (pagination.page - 1) * pagination.pageSize;
    const userId = user.id;

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.blog', 'blog')
      .addSelect(['blog.id', 'blog.title'])
      .where('user.id = :userId', { userId })
      .orderBy('comment.createdAt', 'DESC')
      .skip(offset)
      .take(pagination.pageSize)
      .getMany();

    if (!comments) throw new Error('Comments not found');

    return comments;
  }
}
