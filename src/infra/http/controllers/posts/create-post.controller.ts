import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { NestCreatePostUseCase } from '@/infra/http/nest-use-cases/posts/nest-create-post.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import { CreatePostRequest, createPostSchema } from '@/infra/types/zod/posts';

import { CurrentUser } from '@/infra/auth/create-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostSwagger } from '@/infra/types/swagger/posts';
import {
  noContent201ResponseSwagger,
  unauthorizedErrorSwagger,
} from '@/infra/types/swagger/common';

const bodyValidationPipe = new ZodValidationPipe(createPostSchema);

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('/posts')
export class CreatePostController {
  constructor(private createPost: NestCreatePostUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a post' })
  @ApiBody({ type: CreatePostSwagger })
  @ApiResponse(noContent201ResponseSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreatePostRequest,
    @CurrentUser() userLogged: UserPayload,
  ) {
    const authorId = userLogged.sub;

    await this.createPost.execute({ ...body, authorId });
  }
}
