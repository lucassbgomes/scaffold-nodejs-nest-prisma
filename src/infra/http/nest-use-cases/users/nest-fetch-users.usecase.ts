import { Injectable } from '@nestjs/common';

import { UsersRepository } from '@/domain/website/application/repositories';
import { FetchUsersUseCase } from '@/domain/website/application/use-cases/users/fetch-users.usecase';

@Injectable()
export class NestFetchUsersUseCase extends FetchUsersUseCase {
  constructor(usersRepository: UsersRepository) {
    super(usersRepository);
  }
}
