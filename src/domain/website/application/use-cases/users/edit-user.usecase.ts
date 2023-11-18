import {
  Either,
  NotAllowedError,
  ResourceNotFoundError,
  left,
  right,
} from '@/core/errors';

import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';
import { UserEntity } from '@/domain/website/enterprise/entities';
import { UsersRepository } from '@/domain/website/application/repositories';
import { HashGenerator } from '@/domain/website/application/cryptography/hash-generator';

export type EditUserDataRequest = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserEntityRole;
};

export type EditUserUseCaseRequest = {
  loggedUserId: string;
  loggedUserRole: UserEntityRole;
  userId: string;
  data: EditUserDataRequest;
};

export type EditUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { user: UserEntity }
>;

export class EditUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    loggedUserId,
    loggedUserRole,
    userId,
    data,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (
      (loggedUserId !== userId || data.role || data.email || data.username) &&
      loggedUserRole !== 'ADMIN'
    ) {
      return left(new NotAllowedError());
    }

    const password_hash = data.password
      ? await this.hashGenerator.hash(data.password)
      : undefined;

    user.firstName = data.firstName ?? user.firstName;
    user.lastName = data.lastName ?? user.lastName;
    user.email = data.email ?? user.email;
    user.username = data.username ?? user.username;
    user.password = password_hash ?? user.password;
    user.role = data.role ?? user.role;

    await this.usersRepository.save(user);

    return right({
      user,
    });
  }
}
