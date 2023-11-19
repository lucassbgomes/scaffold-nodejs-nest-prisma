import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { NotAllowedError } from '@/core/errors';
import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';

import { NestDeleteUserUseCase } from '@/infra/http/nest-use-cases/users/nest-delete-user.usecase';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  noContent204ResponseSwagger,
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
} from '@/infra/types/swagger/common';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('/users/:userId')
export class DeleteUserController {
  constructor(private deleteUser: NestDeleteUserUseCase) {}

  @Delete()
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse(noContent204ResponseSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
  @HttpCode(204)
  async handle(@Param('userId') userId: string, @Req() request: Request) {
    const userAuthenticated = request.user as UserPayload | undefined;

    if (!userAuthenticated) {
      throw new UnauthorizedException();
    }

    const loggedUserId = userAuthenticated.sub;
    const loggedUserRole = userAuthenticated.user.role;

    const result = await this.deleteUser.execute({
      loggedUserId,
      loggedUserRole,
      userId,
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
