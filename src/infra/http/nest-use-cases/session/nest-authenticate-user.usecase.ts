import { Injectable } from '@nestjs/common';

import { AuthenticateUserUseCase } from '@/domain/website/application/use-cases/session/authenticate-user.usecase';
import { UsersRepository } from '@/domain/website/application/repositories';

import { HashComparer } from '@/domain/website/application/cryptography/hash-comparer';
import { Encrypter } from '@/domain/website/application/cryptography/encrypter';

@Injectable()
export class NestAuthenticateUserUsecase extends AuthenticateUserUseCase {
  constructor(
    usersRepository: UsersRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
  ) {
    super(usersRepository, hashComparer, encrypter);
  }
}
