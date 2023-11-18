import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { Public } from '@/infra/auth/public';
import {
  AuthenticateUserBodySchema,
  authenticateUserSchema,
} from '@/infra/types/zod/session';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import { NestAuthenticateUserUsecase } from '@/infra/http/nest-use-cases/session/nest-authenticate-user.usecase';

import { InvalidCredentialsError } from '@/domain/website/application/use-cases/session/errors';
import {
  AuthenticateDataSwagger,
  authenticate201ResponseSwagger,
  invalidCredentialsErrorSwagger,
} from '@/infra/types/swagger/sessions';

const bodyValidationPipe = new ZodValidationPipe(authenticateUserSchema);

@ApiTags('Sessions')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: NestAuthenticateUserUsecase) {}

  @Post()
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ type: AuthenticateDataSwagger })
  @ApiResponse(authenticate201ResponseSwagger)
  @ApiResponse(invalidCredentialsErrorSwagger)
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: AuthenticateUserBodySchema,
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
