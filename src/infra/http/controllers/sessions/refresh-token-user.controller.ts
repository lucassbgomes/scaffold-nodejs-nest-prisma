import {
  BadRequestException,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Cookies } from '@/infra/http/decorator/cookies.decorator';
import { Public } from '@/infra/auth/public';
import { RefreshTokenJwtGuard } from '@/infra/auth/strategies/refresh-token-jwt.guard';
import { CurrentUser } from '@/infra/auth/create-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import { NestRefreshTokenUserUseCase } from '@/infra/http/nest-use-cases/session/nest-refresh-token-user.usecase';

import {
  InvalidCredentialsError,
  TokenExpiredError,
} from '@/domain/website/application/use-cases/session/errors';
import { unauthorizedErrorSwagger } from '@/infra/types/swagger/common';
import { authenticate201ResponseSwagger } from '@/infra/types/swagger/sessions';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Sessions')
@Controller('/sessions/refresh-token')
export class RefreshTokenUserController {
  constructor(private refreshTokenUser: NestRefreshTokenUserUseCase) {}

  @Public()
  @UseGuards(RefreshTokenJwtGuard)
  @Post()
  @ApiOperation({ summary: 'Refresh user token' })
  @ApiResponse(authenticate201ResponseSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  async handle(
    @CurrentUser() user: UserPayload,
    @Cookies('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const result = await this.refreshTokenUser.execute({
      refreshTokenUser: refresh_token,
      userId: user.sub,
    });

    if (result.isLeft()) {
      const { value } = result;

      const error = {
        error: value.name,
        message: value.message,
      };

      switch (value.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error);
        case TokenExpiredError:
          throw new BadRequestException(error);
        default:
          throw new BadRequestException(error);
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
