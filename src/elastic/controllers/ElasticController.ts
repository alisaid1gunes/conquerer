import { JsonController, Get, HttpError, HttpCode, QueryParam } from 'routing-controllers';

import { ApiResponseType } from '../../shared/ApiResponseType';
import { Service } from 'typedi';
import { ElasticService } from '../services/ElasticService';
import { TimeFrameDto } from '../dto/TimeFrameDto';
import { BlogListType } from '../../shared/BlogListType';

@JsonController('/elastic')
@Service()
export class ElasticController {
  constructor(private readonly elasticService: ElasticService) {}

  @Get('/')
  @HttpCode(200)
  async addDummy(): Promise<ApiResponseType> {
    try {
      const result = await this.elasticService.createDummy();

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Dummy data indexed successfully',
        data: result,
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }

  @Get('/user-stats')
  @HttpCode(200)
  async getUserStats(): Promise<ApiResponseType> {
    try {
      const result = await this.elasticService.getUserStats();

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'User stats retrieved successfully',
        data: result,
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }
  @Get('/category-rates')
  @HttpCode(200)
  async getCategoryRates(): Promise<ApiResponseType> {
    try {
      const result = await this.elasticService.getCategoryRatesAllTime();

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Category rates retrieved successfully',
        data: result,
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }

  @Get('/post-by-time')
  @HttpCode(200)
  async getPostByTime(@QueryParam('timeFrame') timeFrame: string): Promise<ApiResponseType> {
    try {
      const result = await this.elasticService.getPostByTime({ timeFrame });

      const apiResponse: ApiResponseType = {
        success: true,
        message: 'Post by time retrieved successfully',
        data: result,
      };
      return apiResponse;
    } catch (error: any) {
      throw new HttpError(400, error.message);
    }
  }
}
