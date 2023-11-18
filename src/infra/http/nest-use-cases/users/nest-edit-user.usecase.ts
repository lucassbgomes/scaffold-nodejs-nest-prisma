import { Injectable } from '@nestjs/common';

import { HashGenerator } from '@/domain/website/application/cryptography/hash-generator';
import { UsersRepository } from '@/domain/website/application/repositories';
import { EditUserUseCase } from '@/domain/website/application/use-cases/users/edit-user.usecase';

@Injectable()
export class NestEditUserUseCase extends EditUserUseCase {
  constructor(usersRepository: UsersRepository, hashGenerator: HashGenerator) {
    super(usersRepository, hashGenerator);
  }
}
