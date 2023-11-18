import { Injectable } from '@nestjs/common';

import { HashGenerator } from '@/domain/website/application/cryptography/hash-generator';
import { UsersRepository } from '@/domain/website/application/repositories';
import { RegisterUserUseCase } from '@/domain/website/application/use-cases/users/register-user.usecase';

@Injectable()
export class NestRegisterUserUseCase extends RegisterUserUseCase {
  constructor(usersRepository: UsersRepository, hashGenerator: HashGenerator) {
    super(usersRepository, hashGenerator);
  }
}
