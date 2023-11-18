import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { NotAllowedError } from '@/core/errors';
import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';

import { NestDeletePostUseCase } from '@/infra/http/nest-use-cases/posts/nest-delete-post.usecase';

import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import { CurrentUser } from '@/infra/auth/create-user.decorator';
import {
  noContent204ResponseSwagger,
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
} from '@/infra/types/swagger/common';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('/posts/:postId')
export class DeleteUserController {
  constructor(private deleteUser: NestDeletePostUseCase) {}

  @Delete()
  @ApiOperation({ summary: 'Delete a post by id' })
  @ApiResponse(noContent204ResponseSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('postId') postId: string,
  ) {
    const loggedUserId = userLogged.sub;
    const loggedUserRole = userLogged.user.role;

    const result = await this.deleteUser.execute({
      loggedUserId,
      loggedUserRole,
      postId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(errorNotAllowed);
        default:
          throw new BadRequestException({
            error: error.constructor,
            message: error.message,
          });
      }
    }
  }
}
