import {
  JsonController,
  Get,
  UseBefore,
  Patch,
  Res,
  Body,
  HttpError,
  CurrentUser,
  HttpCode,
  Post,
  Param,
  QueryParam,
  Delete,
} from 'routing-controllers';
import { Response } from 'express';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware';
import { BlogService } from '../services/BlogService';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { User } from '../../users/entities/User';
import { ApiResponseType } from '../../shared/ApiResponseType';
import { Service } from 'typedi';
import { Pagination } from '../../shared/pagination';
import { BlogListType } from '../../shared/BlogListType';
import { UpdateBlogDto } from '../dto/UpdateBlogDto';

@JsonController('/blogs')
@UseBefore(AuthMiddleware)
@Service()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @HttpCode(201)
  async createBlog(
    @Res() response: Response,
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser() user: User,
  ): Promise<ApiResponseType> {
    try {
      await this.blogService.createBlog(createBlogDto, user);

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Blog successfully saved',
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }

  @Patch('/:id')
  @HttpCode(200)
  async updateBlog(
    @Res() response: Response,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ApiResponseType> {
    try {
      await this.blogService.updateBlog(id, user, updateBlogDto);

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Blog successfully updated',
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }
  @Get('/all')
  @HttpCode(200)
  async getAllBlog(
    @QueryParam('category') category: string,
    @QueryParam('page') page: number = 1,
    @QueryParam('pageSize') pageSize: number = 25,
    @QueryParam('search') search: string,
    @QueryParam('type') type: BlogListType,
    @CurrentUser() user: User,
  ): Promise<ApiResponseType> {
    try {
      const pagination = new Pagination(page, pageSize);

      const result = await this.blogService.getAllBlogs(user, pagination, category, search, type);

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Blogs successfully retrieved',
        data: result,
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }

  @Get('/:id')
  @HttpCode(200)
  async getBlog(@Param('id') id: number): Promise<ApiResponseType> {
    try {
      const result = await this.blogService.getBlog(id);

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Blogs successfully retrieved',
        data: result,
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }

  @Delete('/:id')
  @HttpCode(200)
  async deleteBlog(@Param('id') id: number, @CurrentUser() user: User): Promise<ApiResponseType> {
    try {
      await this.blogService.deleteBlog(id, user);

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Blogs successfully deleted',
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }
}
