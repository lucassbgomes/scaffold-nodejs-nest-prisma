import { Either, left, right } from '@/core/errors';
import { UsersRepository } from '@/domain/website/application/repositories';
import { HashComparer } from '@/domain/website/application/cryptography/hash-comparer';
import { Encrypter } from '@/domain/website/application/cryptography/encrypter';
import { InvalidCredentialsError } from './errors';

export type AuthenticateUserUseCaseRequest = {
  username: string;
  password: string;
};

export type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    username,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    let user = await this.usersRepository.findByEmail(username);

    if (!user) {
      user = await this.usersRepository.findByUsername(username);

      if (!user) {
        return left(new InvalidCredentialsError());
      }
    }

    const doesPasswordMatches = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!doesPasswordMatches) {
      return left(new InvalidCredentialsError());
    }

    const { firstName, lastName, role } = user;
    const name = `${firstName} ${lastName}`;

    const accessToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
        user: {
          name,
          role,
        },
      },
      { expiresIn: '15m' }, // 15 minutes
    );

    const refreshToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
        user: {
          name,
          role,
        },
      },
      { expiresIn: '7d' }, // 7 days
    );

    return right({
      accessToken,
      refreshToken,
    });
  }
}
