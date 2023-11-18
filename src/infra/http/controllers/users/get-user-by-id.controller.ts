import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { NestGetUserByIdUseCase } from '@/infra/http/nest-use-cases/users/nest-get-user-by-id.usecase';
import { ResourceNotFoundError } from '@/core/errors';
import { UserPresenter } from '@/infra/http/presenters/users/user.presenter';

@Controller('/users/:userId')
export class GetUserByIdController {
  constructor(private getUserById: NestGetUserByIdUseCase) {}

  @Get()
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
