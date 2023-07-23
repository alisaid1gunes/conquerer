import { Service } from 'typedi';
import { Client } from '@elastic/elasticsearch';
import users from '../users.json';
import posts from '../posts.json';
import { TimeFrameDto } from '../dto/TimeFrameDto';

@Service()
export class ElasticService {
  private client: any;
  constructor() {
    this.client = new Client({
      node: 'https://13ca696f9e054398bba211666697fbed.us-central1.gcp.cloud.es.io:443',
      auth: {
        apiKey: 'TVc5bmdva0JLUkdHY0xqMkxNX2o6dWMxSk4zcWdUTWlFVkFyWWZ6enRvZw==',
      },
    });
  }

  async createDummy(): Promise<boolean> {
    await this.indexUsers();
    await this.indexBlogs();
    return true;
  }

  async indexUsers() {
    const body: any[] = users.reduce((acc: any[], doc) => {
      acc.push({ index: { _index: 'users_new' } }, doc);
      return acc;
    }, []);
    const { body: bulkResponse } = await this.client.bulk({ refresh: true, body });

    if (bulkResponse?.errors) {
      console.error('Error indexing blogs:', bulkResponse);
    } else {
      console.log('Blogs indexed successfully');
    }
  }

  async indexBlogs() {
    const body: any[] = posts.reduce((acc: any[], doc) => {
      acc.push({ index: { _index: 'blogs_new' } }, doc);
      return acc;
    }, []);
    const { body: bulkResponse } = await this.client.bulk({ refresh: true, body });

    if (bulkResponse?.errors) {
      console.error('Error indexing blogs:', bulkResponse);
    } else {
      console.log('Blogs indexed successfully');
    }
  }

  async getPostByTime(timeFrameDto: TimeFrameDto): Promise<any> {
    try {
      let dateRange: string;

      if (timeFrameDto.timeFrame === 'weekly') {
        dateRange = 'now-1w/w';
      } else if (timeFrameDto.timeFrame === 'monthly') {
        dateRange = 'now-1M/M';
      } else if (timeFrameDto.timeFrame === 'yearly') {
        dateRange = 'now-1y/y';
      } else {
        throw new Error('Invalid timeFrame. Allowed values are: weekly, monthly, yearly');
      }

      const response = await this.client.search({
        index: 'blogs_new',
        body: {
          query: {
            range: {
              createdAt: {
                gte: dateRange,
              },
            },
          },
          aggs: {
            categories: {
              terms: {
                field: 'category.keyword',
              },
              aggs: {
                post_count: {
                  cardinality: {
                    field: 'title.keyword',
                  },
                },
              },
            },
          },
        },
      });

      const postsByCategory = response.aggregations.categories.buckets.map((bucket: any) => ({
        category: bucket.key,
        count: bucket.post_count.value,
      }));

      return postsByCategory;
    } catch (error: any) {
      console.error('Error fetching post by time:', error.message);
      throw new Error('Failed to get post by time');
    }
  }

  async getUserStats(): Promise<any> {
    try {
      const totalUsersResponse = await this.client.count({
        index: 'users_new',
      });

      const totalUsersCount = totalUsersResponse.count;

      const bloggersResponse = await this.client.search({
        index: 'blogs_new',
        body: {
          size: 0,
          aggs: {
            unique_bloggers: {
              cardinality: {
                field: 'profile.username.keyword',
              },
            },
          },
        },
      });
      console.dir({ bloggersResponse }, { depth: null });
      const bloggerCount = bloggersResponse.aggregations.unique_bloggers.value;

      const readerCount = totalUsersCount - bloggerCount;

      return {
        totalUsers: totalUsersCount,
        bloggers: bloggerCount,
        readers: readerCount,
      };
    } catch (error: any) {
      console.error('Error fetching user stats:', error.message);
      throw new Error('Failed to get user stats');
    }
  }

  async getCategoryRatesAllTime(): Promise<{ [category: string]: number }> {
    const result = await this.client.search({
      index: 'blogs_new',
      size: 0,
      body: {
        aggs: {
          categories: {
            terms: {
              field: 'category.keyword',
              size: 4,
            },
          },
        },
      },
    });

    const categoryRates: { [category: string]: number } = {};
    const totalBlogs = result.hits.total.value;

    if (result.aggregations && result.aggregations.categories && result.aggregations.categories.buckets) {
      const buckets = result.aggregations.categories.buckets;
      buckets.forEach((bucket: any) => {
        const category = bucket.key;
        const count = bucket.doc_count;
        const rate = (count / totalBlogs) * 100;
        categoryRates[category] = rate;
      });
    }

    return categoryRates;
  }
}
