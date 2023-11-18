import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { NotAllowedError } from '@/core/errors';
import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';

import { CurrentUser } from '@/infra/auth/create-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';

import { NestEditPostUseCase } from '@/infra/http/nest-use-cases/posts/nest-edit-post.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';

import { EditPostRequest, editPostSchema } from '@/infra/types/zod/posts';
import { EditPostSwagger } from '@/infra/types/swagger/posts';
import {
  noContent204ResponseSwagger,
  resourceNotFoundErrorSwagger,
  unauthorizedErrorSwagger,
} from '@/infra/types/swagger/common';

const bodyValidationPipe = new ZodValidationPipe(editPostSchema);

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('/posts/:postId')
export class EditPostController {
  constructor(private editPost: NestEditPostUseCase) {}

  @Patch()
  @ApiOperation({ summary: 'Edit a post by id' })
  @ApiBody({ type: EditPostSwagger })
  @ApiResponse(noContent204ResponseSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
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
