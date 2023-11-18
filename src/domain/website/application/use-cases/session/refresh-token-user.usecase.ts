import { Either, left, right } from '@/core/errors';
import { UsersRepository } from '@/domain/website/application/repositories';
import { Encrypter } from '@/domain/website/application/cryptography/encrypter';
import { InvalidCredentialsError, TokenExpiredError } from './errors';

export type RefreshTokenUserUseCaseRequest = {
  refreshTokenUser: string;
  userId: string;
};

export type RefreshTokenUserUseCaseResponse = Either<
  TokenExpiredError | InvalidCredentialsError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class RefreshTokenUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    refreshTokenUser,
    userId,
  }: RefreshTokenUserUseCaseRequest): Promise<RefreshTokenUserUseCaseResponse> {
    const verifyRefreshTokenUser =
      await this.encrypter.verify(refreshTokenUser);

    if (!verifyRefreshTokenUser) {
      return left(new TokenExpiredError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
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
      { expiresIn: '10s' }, // 15 minutes
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
