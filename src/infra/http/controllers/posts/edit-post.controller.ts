import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';

import { NotAllowedError } from '@/core/errors';
import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';

import { CurrentUser } from '@/infra/auth/create-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';

import { NestEditPostUseCase } from '@/infra/http/nest-use-cases/posts/nest-edit-post.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';

import { EditPostRequest, editPostSchema } from '@/infra/types/zod/posts';

const bodyValidationPipe = new ZodValidationPipe(editPostSchema);

@Controller('/posts/:postId')
export class EditPostController {
  constructor(private editPost: NestEditPostUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('postId') postId: string,
    @Body(bodyValidationPipe) body: EditPostRequest,
  ) {
    const loggedUserId = userLogged.sub;
    const loggedUserRole = userLogged.user.role;

    const editPost = {
      loggedUserId,
      loggedUserRole,
      postId,
      data: body,
    };

    const result = await this.editPost.execute(editPost);

    if (result.isLeft()) {
      const error = {
        error: result.value.constructor,
        message: result.value.message,
      };

      switch (result.value.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(errorNotAllowed);
        default:
          throw new BadRequestException(error);
      }
    }
  }
}
