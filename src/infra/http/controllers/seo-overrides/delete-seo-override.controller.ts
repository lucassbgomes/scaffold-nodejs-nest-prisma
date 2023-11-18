import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  Param,
} from '@nestjs/common';

import { NotAllowedError } from '@/core/errors';
import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';

import { NestDeleteSeoOverrideUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-delete-seo-override.usecase';

import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import { CurrentUser } from '@/infra/auth/create-user.decorator';

@Controller('/seo-overrides/:seoOverrideId')
export class DeleteUserController {
  constructor(private deleteUser: NestDeleteSeoOverrideUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('seoOverrideId') seoOverrideId: string,
  ) {
    const loggedUserId = userLogged.sub;
    const loggedUserRole = userLogged.user.role;

    const result = await this.deleteUser.execute({
      loggedUserId,
      loggedUserRole,
      seoOverrideId,
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
