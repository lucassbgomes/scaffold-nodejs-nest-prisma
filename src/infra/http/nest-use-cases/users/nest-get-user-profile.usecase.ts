import { Injectable } from '@nestjs/common';

import { UsersRepository } from '@/domain/website/application/repositories';
import { GetUserProfileUseCase } from '@/domain/website/application/use-cases/users/get-user-profile.usecase';

@Injectable()
export class NestGetUserProfileUseCase extends GetUserProfileUseCase {
  constructor(usersRepository: UsersRepository) {
    super(usersRepository);
  }
}
