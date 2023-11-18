import { Either, left, right } from '@/core/errors';

import { UserEntity } from '@/domain/website/enterprise/entities';
import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';
import { UsersRepository } from '@/domain/website/application/repositories';
import { HashGenerator } from '@/domain/website/application/cryptography/hash-generator';

import {
  EmailUserAlreadyExistsError,
  UsernameUserAlreadyExistsError,
} from './errors';

export type RegisterUserUseCaseRequest = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: UserEntityRole;
};

export type RegisterUserUseCaseResponse = Either<
  EmailUserAlreadyExistsError | UsernameUserAlreadyExistsError,
  { user: UserEntity }
>;

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    dataUser: RegisterUserUseCaseRequest,
  ): Promise<RegisterUserUseCaseResponse> {
    const { email, username } = dataUser;

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new EmailUserAlreadyExistsError());
    }

    const userWithSameUsername =
      await this.usersRepository.findByUsername(username);

    if (userWithSameUsername) {
      return left(new UsernameUserAlreadyExistsError());
    }

    const { firstName, lastName, password, role } = dataUser;
    const password_hash = await this.hashGenerator.hash(password);

    const user = UserEntity.create({
      firstName,
      lastName,
      email,
      username,
      password: password_hash,
      role,
    });

    await this.usersRepository.create(user);

    return right({ user });
  }
}
