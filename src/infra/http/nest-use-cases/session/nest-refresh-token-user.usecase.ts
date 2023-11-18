import { Injectable } from '@nestjs/common';

import { Encrypter } from '@/domain/website/application/cryptography/encrypter';
import { UsersRepository } from '@/domain/website/application/repositories';
import { RefreshTokenUserUseCase } from '@/domain/website/application/use-cases/session/refresh-token-user.usecase';

@Injectable()
export class NestRefreshTokenUserUseCase extends RefreshTokenUserUseCase {
  constructor(usersRepository: UsersRepository, encrypter: Encrypter) {
    super(usersRepository, encrypter);
  }
}
