import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';

import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { DeleteUserController } from '@/infra/http/controllers/users/delete-user.controller';
import { EditUserController } from '@/infra/http/controllers/users/edit-user.controller';
import { FetchUsersController } from '@/infra/http/controllers/users/fetch-users.controller';
import { GetUserByIdController } from '@/infra/http/controllers/users/get-user-by-id.controller';
import { GetUserProfileController } from '@/infra/http/controllers/users/get-user-profile.controller';
import { RegisterUserController } from '@/infra/http/controllers/users/register-user.controller';

import { NestDeleteUserUseCase } from '@/infra/http/nest-use-cases/users/nest-delete-user.usecase';
import { NestEditUserUseCase } from '@/infra/http/nest-use-cases/users/nest-edit-user.usecase';
import { NestFetchUsersUseCase } from '@/infra/http/nest-use-cases/users/nest-fetch-users.usecase';
import { NestGetUserByIdUseCase } from '@/infra/http/nest-use-cases/users/nest-get-user-by-id.usecase';
import { NestGetUserProfileUseCase } from '@/infra/http/nest-use-cases/users/nest-get-user-profile.usecase';
import { NestRegisterUserUseCase } from '@/infra/http/nest-use-cases/users/nest-register-user.usecase';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterUserController,
    FetchUsersController,
    GetUserByIdController,
    GetUserProfileController,
    EditUserController,
    DeleteUserController,
  ],
  providers: [
    NestRegisterUserUseCase,
    NestFetchUsersUseCase,
    NestGetUserByIdUseCase,
    NestGetUserProfileUseCase,
    NestEditUserUseCase,
    NestDeleteUserUseCase,
  ],
  exports: [
    NestRegisterUserUseCase,
    NestFetchUsersUseCase,
    NestGetUserByIdUseCase,
    NestGetUserProfileUseCase,
    NestEditUserUseCase,
    NestDeleteUserUseCase,
  ],
})
export class UsersModule {}
