import { RefreshTokenUserUseCase } from '@/domain/website/application/use-cases/session/refresh-token-user.usecase';

import { InMemoryUsersRepository } from 'test/repositories';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import makeUser from 'test/factories/make-user';

let usersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: RefreshTokenUserUseCase;

describe('Refresh Token User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    encrypter = new FakeEncrypter();

    fakeHasher = new FakeHasher();

    sut = new RefreshTokenUserUseCase(usersRepository, encrypter);
  });

  it('should be able to generate a new token with refresh_token', async () => {
    const user = makeUser({
      email: 'test@example.com',
      password: await fakeHasher.hash('123456'),
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      refreshTokenUser: 'refresh-token-user',
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });
});
