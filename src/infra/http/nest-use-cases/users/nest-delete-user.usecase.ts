import { Injectable } from '@nestjs/common';

import { UsersRepository } from '@/domain/website/application/repositories';
import { DeleteUserUseCase } from '@/domain/website/application/use-cases/users/delete-user.usecase';

@Injectable()
export class NestDeleteUserUseCase extends DeleteUserUseCase {
  constructor(usersRepository: UsersRepository) {
    super(usersRepository);
  }
}
