import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { ResourceNotFoundError } from '@/core/errors';

import { NestGetPostDetailsUseCase } from '@/infra/http/nest-use-cases/posts/nest-get-post-details.usecase';
import {
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
} from '@/infra/types/swagger/common';
import { getPostDetailsSwagger } from '@/infra/types/swagger/posts';
import { PostDetailsPresenter } from '@/infra/http/presenters/posts/post-details.presenter';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('/posts/:postId/details')
export class GetPostDetailsController {
  constructor(private getPostDetails: NestGetPostDetailsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get the details of a post by id' })
  @ApiResponse(getPostDetailsSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
  async handle(@Param('postId') postId: string) {
    const result = await this.getPostDetails.execute({
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
      post: PostDetailsPresenter.toJson(post),
    };
  }
}
