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
  QueryParam,
} from 'routing-controllers';
import { Response } from 'express';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware';

import { User } from '../../users/entities/User';
import { ApiResponseType } from '../../shared/ApiResponseType';
import { Service } from 'typedi';
import { Pagination } from '../../shared/pagination';
import { BlogListType } from '../../shared/BlogListType';
import { CommentService } from '../services/CommentService';
import { CreateCommentDto } from '../dto/CreateCommentDto';

@JsonController('/comments')
@UseBefore(AuthMiddleware)
@Service()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/')
  @HttpCode(201)
  async createComment(
    @Res() response: Response,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ): Promise<ApiResponseType> {
    try {
      await this.commentService.createComment(user, createCommentDto);

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Comment successfully saved',
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }

  @Get('/my')
  @HttpCode(200)
  async getMyComments(
    @QueryParam('page') page: number = 1,
    @QueryParam('pageSize') pageSize: number = 25,
    @CurrentUser() user: User,
  ): Promise<ApiResponseType> {
    try {
      const pagination = new Pagination(page, pageSize);

      const result = await this.commentService.getMyComments(user, pagination);

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'My Comments successfully retrieved',
        data: result,
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }
}
