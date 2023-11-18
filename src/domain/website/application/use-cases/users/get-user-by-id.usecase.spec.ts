import { ResourceNotFoundError } from '@/core/errors';

import { GetUserByIdUseCase } from '@/domain/website/application/use-cases/users/get-user-by-id.usecase';

import makeUser from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserByIdUseCase;

describe('Get User By ID Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserByIdUseCase(usersRepository);
  });

  it('should be able to get a user by id', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const result = await sut.execute({ userId: user.id.toString() });

    expect(result.isRight()).toEqual(true);

    if (result.isRight()) {
      expect(result.value.user.id.toString()).toEqual(user.id.toString());
    }
  });

  it('should not be able to get user by id inexistent', async () => {
    const result = await sut.execute({ userId: 'inexistent-id' });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
