import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { ResourceNotFoundError } from '@/core/errors';

import { NestGetPostByIdUseCase } from '@/infra/http/nest-use-cases/posts/nest-get-post-by-id.usecase';
import { PostPresenter } from '@/infra/http/presenters/posts/post.presenter';

@Controller('/posts/:postId')
export class GetPostByIdController {
  constructor(private getPostById: NestGetPostByIdUseCase) {}

  @Get()
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
