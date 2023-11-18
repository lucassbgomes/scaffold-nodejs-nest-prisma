import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { ResourceNotFoundError } from '@/core/errors';

import { NestGetPostByIdUseCase } from '@/infra/http/nest-use-cases/posts/nest-get-post-by-id.usecase';
import { PostPresenter } from '@/infra/http/presenters/posts/post.presenter';
import {
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
} from '@/infra/types/swagger/common';
import { getPostByIdSwagger } from '@/infra/types/swagger/posts';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('/posts/:postId')
export class GetPostByIdController {
  constructor(private getPostById: NestGetPostByIdUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse(getPostByIdSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
  async handle(@Param('postId') postId: string) {
    const result = await this.getPostById.execute({
      postId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            error: 'ResourceNotFoundError',
            message: error.message,
          });
        default:
          throw new BadRequestException({
            error: error.name,
            message: error.message,
          });
      }
    }

    const { post } = result.value;

    return {
      post: PostPresenter.toJson(post),
    };
  }
}
