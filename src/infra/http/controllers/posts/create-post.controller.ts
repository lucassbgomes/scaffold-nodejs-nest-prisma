import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { NestCreatePostUseCase } from '@/infra/http/nest-use-cases/posts/nest-create-post.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import { CreatePostRequest, createPostSchema } from '@/infra/types/zod/posts';

import { CurrentUser } from '@/infra/auth/create-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';

const bodyValidationPipe = new ZodValidationPipe(createPostSchema);

@Controller('/posts')
export class CreatePostController {
  constructor(private createPost: NestCreatePostUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreatePostRequest,
    @CurrentUser() userLogged: UserPayload,
  ) {
    const authorId = userLogged.sub;

    await this.createPost.execute({ ...body, authorId });
  }
}
