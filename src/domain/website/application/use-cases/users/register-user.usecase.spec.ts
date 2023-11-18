import { RegisterUserUseCase } from '@/domain/website/application/use-cases/users/register-user.usecase';
import {
  EmailUserAlreadyExistsError,
  UsernameUserAlreadyExistsError,
} from '@/domain/website/application/use-cases/users/errors';

import { InMemoryUsersRepository } from 'test/repositories';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import makeUser from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

let sut: RegisterUserUseCase;

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to register a user', async () => {
    const username = 'lucassbgomes';

    const { isLeft, isRight } = await sut.execute({
      firstName: 'Lucas',
      lastName: 'Gomes',
      username,
      email: 'lucas.sbgomes@gmail.com',
      password: '123456',
    });

    expect(isRight()).toEqual(true);
    expect(isLeft()).toEqual(false);
  });

  it("should be able to hash the user's password upon registration", async () => {
    await sut.execute({
      firstName: 'Lucas',
      lastName: 'Gomes',
      username: 'lucassbgomes',
      email: 'lucas.sbgomes@gmail.com',
      password: '123456',
    });

    const user = inMemoryUsersRepository.items[0];

    const isPasswordCorrectlyHashed = await fakeHasher.compare(
      '123456',
      user.password,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to crate with same email twice', async () => {
    const email = 'lucas.sbgomes@gmail.com';

    const user = makeUser({ email });
    await inMemoryUsersRepository.create(user);

    const { isLeft, isRight, value } = await sut.execute({
      firstName: 'Lucas',
      lastName: 'Gomes',
      username: 'lucassbgomes',
      email,
      password: '123456789',
    });

    expect(isRight()).toEqual(false);
    expect(isLeft()).toEqual(true);
    expect(value).toBeInstanceOf(EmailUserAlreadyExistsError);
  });

  it('should not be able to crate with same username twice', async () => {
    const username = 'lucassbgomes';

    const user = makeUser({ username });
    await inMemoryUsersRepository.create(user);

    const { isLeft, isRight, value } = await sut.execute({
      firstName: 'Lucas',
      lastName: 'Gomes',
      username,
      email: 'lucas.sbgomes@gmail.com',
      password: '123456789',
    });

    expect(isRight()).toEqual(false);
    expect(isLeft()).toEqual(true);
    expect(value).toBeInstanceOf(UsernameUserAlreadyExistsError);
  });

  it('should be able to register to many users', async () => {
    const userMake1 = makeUser();
    const user1 = {
      firstName: userMake1.firstName,
      lastName: userMake1.lastName,
      username: userMake1.username,
      email: userMake1.email,
      password: userMake1.password,
    };

    const userMake2 = makeUser();
    const user2 = {
      firstName: userMake2.firstName,
      lastName: userMake2.lastName,
      username: userMake2.username,
      email: userMake2.email,
      password: userMake2.password,
    };

    const result1 = await sut.execute({ ...user1 });
    const result2 = await sut.execute({ ...user2 });

    if (result1.isRight()) {
      expect(inMemoryUsersRepository.items[0]).toEqual(result1.value.user);
    }

    if (result2.isRight()) {
      expect(inMemoryUsersRepository.items[1]).toEqual(result2.value.user);
    }

    expect(inMemoryUsersRepository.items.length).toEqual(2);
  });
});
