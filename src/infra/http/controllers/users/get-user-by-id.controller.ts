import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { NestGetUserByIdUseCase } from '@/infra/http/nest-use-cases/users/nest-get-user-by-id.usecase';
import { ResourceNotFoundError } from '@/core/errors';
import { UserPresenter } from '@/infra/http/presenters/users/user.presenter';
import {
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
} from '@/infra/types/swagger/common';
import { getUserSwagger } from '@/infra/types/swagger/users';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('/users/:userId')
export class GetUserByIdController {
  constructor(private getUserById: NestGetUserByIdUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse(getUserSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
  async handle(@Param('userId') userId: string) {
    const result = await this.getUserById.execute({
      userId,
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

    const { user } = result.value;

    return {
      user: UserPresenter.toJson(user),
    };
  }
}
