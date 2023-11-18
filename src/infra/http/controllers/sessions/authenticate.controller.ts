import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';

import { Public } from '@/infra/auth/public';
import {
  AuthenticateUserBodySchema,
  authenticateUserSchema,
} from '@/infra/types/zod/session';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import { NestAuthenticateUserUsecase } from '@/infra/http/nest-use-cases/session/nest-authenticate-user.usecase';

import { InvalidCredentialsError } from '@/domain/website/application/use-cases/session/errors';

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: NestAuthenticateUserUsecase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateUserSchema))
  async handle(
    @Body() body: AuthenticateUserBodySchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { username, password } = body;
    const result = await this.authenticateUser.execute({
      username,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken, refreshToken } = result.value;

    response.cookie('refresh_token', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    });

    return { access_token: accessToken };
  }
}
