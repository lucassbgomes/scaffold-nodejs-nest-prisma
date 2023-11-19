import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';

import { NestGetUserProfileUseCase } from '@/infra/http/nest-use-cases/users/nest-get-user-profile.usecase';
import { UserPresenter } from '@/infra/http/presenters/users/user.presenter';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
} from '@/infra/types/swagger/common';
import { getUserSwagger } from '@/infra/types/swagger/users';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('/me')
export class GetUserProfileController {
  constructor(private getUserProfile: NestGetUserProfileUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse(getUserSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
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
