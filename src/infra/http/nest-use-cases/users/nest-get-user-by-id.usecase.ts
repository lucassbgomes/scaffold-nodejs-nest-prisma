import { Injectable } from '@nestjs/common';

import { UsersRepository } from '@/domain/website/application/repositories';
import { GetUserByIdUseCase } from '@/domain/website/application/use-cases/users/get-user-by-id.usecase';

@Injectable()
export class NestGetUserByIdUseCase extends GetUserByIdUseCase {
  constructor(usersRepository: UsersRepository) {
    super(usersRepository);
  }
}
