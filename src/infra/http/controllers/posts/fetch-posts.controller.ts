import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

import {
  PageQueryParamSchema,
  SizeQueryParamSchema,
  pageQueryValidationPipe,
  sizeQueryValidationPipe,
} from '@/infra/types/zod/common';
import { NestFetchPostsUseCase } from '@/infra/http/nest-use-cases/posts/nest-fetch-posts.usecase';
import { PostPresenter } from '@/infra/http/presenters/posts/post.presenter';
import {
  pageQueryParamSwagger,
  sizeQueryParamSwagger,
  unauthorizedErrorSwagger,
} from '@/infra/types/swagger/common';
import { fetchPostsSwagger } from '@/infra/types/swagger/posts';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('/posts')
export class FetchPostsController {
  constructor(private fetchPosts: NestFetchPostsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Fetch posts' })
  @ApiResponse(fetchPostsSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiQuery(sizeQueryParamSwagger)
  @ApiQuery(pageQueryParamSwagger)
  async handle(
    @Query('size', sizeQueryValidationPipe) size: SizeQueryParamSchema,
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { value } = await this.fetchPosts.execute({
      page: page ?? 1,
      size,
    });

    const posts = value?.posts.map(PostPresenter.toJson) ?? [];

    return {
      posts,
    };
  }
}
