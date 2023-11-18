import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { NestGetUserProfileUseCase } from '@/infra/http/nest-use-cases/users/nest-get-user-profile.usecase';
import { Request } from 'express';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';
import { UserPresenter } from '../../presenters/users/user.presenter';

@Controller('/me')
export class GetUserProfileController {
  constructor(private getUserProfile: NestGetUserProfileUseCase) {}

  @Get()
  async handle(@Req() request: Request) {
    const userAuthenticated = request.user as UserPayload | undefined;

    if (!userAuthenticated) {
      throw new UnauthorizedException(errorNotAllowed);
    }

    const userId = userAuthenticated.sub;

    const result = await this.getUserProfile.execute({ userId });

    if (result.isRight()) {
      const { user } = result.value;

      return {
        user: UserPresenter.toJson(user),
      };
    }
  }
}
