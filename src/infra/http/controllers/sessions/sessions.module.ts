import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';

import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { AuthenticateController } from '@/infra/http/controllers/sessions/authenticate.controller';
import { RefreshTokenUserController } from '@/infra/http/controllers/sessions/refresh-token-user.controller';

import { NestAuthenticateUserUsecase } from '@/infra/http/nest-use-cases/session/nest-authenticate-user.usecase';
import { NestRefreshTokenUserUseCase } from '@/infra/http/nest-use-cases/session/nest-refresh-token-user.usecase';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateController, RefreshTokenUserController],
  providers: [NestAuthenticateUserUsecase, NestRefreshTokenUserUseCase],
  exports: [NestAuthenticateUserUsecase, NestRefreshTokenUserUseCase],
})
export class SessionsModule {}
