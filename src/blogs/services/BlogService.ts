import { Service } from 'typedi';
import { Blog } from '../entities/Blog';
import { Pagination } from '../../shared/pagination';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { User } from '../../users/entities/User';
import { CategoryService } from '../../categories/services/CategoryService';
import { BlogRepository } from '../repositories/BlogRepository';
import { BlogListType } from '../../shared/BlogListType';
import { UpdateBlogDto } from '../dto/UpdateBlogDto';

@Service()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private categoryService: CategoryService,
  ) {}

  async getAllBlogs(
    user: User,
    pagination: Pagination,
    category?: string,
    search?: string,
    type?: BlogListType,
  ): Promise<{ blogs: Blog[]; total: number }> {
    const skipCount = (pagination.page - 1) * pagination.pageSize;
    const query = this.blogRepository.createQueryBuilder('blog');

    if (search) {
      if (type === BlogListType.MY || category)
        throw new Error(
          'When the search process starts, category-based listing cannot be made or my own blog posts filter cannot be used.',
        );
      query.andWhere('blog.title ILIKE :searchValue OR blog.title ILIKE :searchValue', {
        searchValue: `%${search}%`,
      });
    }
    if (category) {
      if (type === BlogListType.MY || search)
        throw new Error(
          'When the category-based listing process starts, searching cannot be made or my own blog posts filter cannot be used.',
        );
      const categoryValue = await this.categoryService.getCategoryWithName(category);
      if (!categoryValue) throw new Error('Category is not available');
      const categoryId = categoryValue.id;
      query.where('blog.category = :categoryId', { categoryId });
    }
    if (type === BlogListType.MY) {
      if (category || search)
        throw new Error(
          'When the  my own blog posts filter process starts, searching cannot be made or category-based listing cannot be used.',
        );
      const userId = user.id;
      query.where('blog.author = :userId', { userId });
    }

    query
      .select(['blog.id', 'blog.title'])
      .leftJoin('blog.author', 'author')
      .addSelect('author.username')
      .leftJoin('blog.category', 'category')
      .addSelect(['category.name'])
      .leftJoin('blog.comments', 'comments');

    query.loadRelationCountAndMap('blog.commentCount', 'blog.comments');

    const [blogs, count] = await query
      .orderBy('blog.createdAt', 'DESC')
      .limit(pagination.pageSize)
      .offset(skipCount)
      .getManyAndCount();

    return { blogs, total: count };
  }

  async getBlog(id: number): Promise<Blog> {
    const query = this.blogRepository.createQueryBuilder('blog');
    query.where('blog.id = :id', { id });

    query
      .select([
        'blog.id',
        'blog.title',
        'blog.createdAt',
        'blog.updateAt',
        'author.username AS authorUsername',
        'category.name AS categoryName',
        'comments.id AS commentId',
        'comments.content AS commentContent',
        'comments.createdAt AS commentCreatedAt',
      ])
      .leftJoin('blog.author', 'author')
      .leftJoin('blog.category', 'category')
      .leftJoin('blog.comments', 'comments')
      .leftJoin('comments.user', 'commentUser')
      .addSelect('author.username')
      .addSelect('category.name')
      .addSelect('commentUser.username AS commentUsername')
      .addSelect('comments.content')
      .addSelect('comments.createdAt');

    const result = await query.getOne();

    if (!result) throw new Error('Blog not found');

    return result;
  }

  async getBlogDefault(id: number): Promise<Blog | null> {
    return await this.blogRepository.findOne({ where: { id: id } });
  }

  async createBlog(createBlogDto: CreateBlogDto, user: User): Promise<void> {
    const blog = new Blog();
    blog.title = createBlogDto.title;
    blog.author = user;
    blog.content = createBlogDto.content;
    const isValidCategory = await this.categoryService.getCategoryWithName(createBlogDto.category);
    if (!isValidCategory) throw new Error('Category id not valid');
    blog.category = isValidCategory;
    const result = await this.blogRepository.save(blog);
    if (!result) throw new Error('Blog is not created');
  }

  async updateBlog(id: number, user: User, updateBlogDto: UpdateBlogDto): Promise<void> {
    const blog = await this.blogRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
    if (!blog) throw new Error('Blog is not found');
    if (blog?.author.id !== user.id) throw new Error('Blog only updatable for its author');
    const result = await this.blogRepository.update(id, updateBlogDto);
    if (!result) throw new Error('Blog could not be updated');
  }

  async deleteBlog(id: number, user: User): Promise<void> {
    const blog = await this.blogRepository.findOne({ where: { id }, relations: ['comments', 'author'] });
    if (blog) {
      if (blog?.author.id !== user.id) throw new Error('Blog only deletable for author');
      await this.blogRepository.softRemove(blog);
    }
  }
}
