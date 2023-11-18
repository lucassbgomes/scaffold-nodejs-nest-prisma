import { AuthenticateUserUseCase } from '@/domain/website/application/use-cases/session/authenticate-user.usecase';

import { InMemoryUsersRepository } from 'test/repositories';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import makeUser from 'test/factories/make-user';

let usersRepository: InMemoryUsersRepository;
let hasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateUserUseCase;

describe('Create Session User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateUserUseCase(usersRepository, hasher, encrypter);
  });

  it('should be able to create session', async () => {
    const user = makeUser({
      email: 'test@example.com',
      password: await hasher.hash('123456'),
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      username: 'test@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });

  it('should not be able to create session with wrong email or username', async () => {
    const result = await sut.execute({
      username: 'lucassbgomes',
      password: '123456789',
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.isRight()).toEqual(false);
  });

  it('should not be able to create session with wrong password', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const result = await sut.execute({
      username: user.email,
      password: '123456',
    });

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
  });
});
