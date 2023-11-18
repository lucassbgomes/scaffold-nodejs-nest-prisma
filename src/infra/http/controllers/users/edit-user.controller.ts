import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { NotAllowedError } from '@/core/errors';
import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';

import { EditUserDataRequest } from '@/domain/website/application/use-cases/users/edit-user.usecase';

import { NestEditUserUseCase } from '@/infra/http/nest-use-cases/users/nest-edit-user.usecase';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import { editUserSchema } from '@/infra/types/zod/users';

const bodyValidationPipe = new ZodValidationPipe(editUserSchema);

@Controller('/users/:userId')
export class EditUserController {
  constructor(private editUser: NestEditUserUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('userId') userId: string,
    @Body(bodyValidationPipe) body: EditUserDataRequest,
    @Req() request: Request,
  ) {
    const userAuthenticated = request.user as UserPayload | undefined;

    if (!userAuthenticated) {
      throw new UnauthorizedException(errorNotAllowed);
    }

    const loggedUserId = userAuthenticated.sub;
    const loggedUserRole = userAuthenticated.user.role;

    const editUser = {
      loggedUserId,
      loggedUserRole,
      userId,
      data: body,
    };

    const result = await this.editUser.execute(editUser);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(errorNotAllowed);
        default:
          throw new BadRequestException({
            error: error.constructor,
            message: error.message,
          });
      }
    }
  }
}
