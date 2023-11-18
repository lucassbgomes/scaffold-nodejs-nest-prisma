import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';

import { DeleteUserUseCase } from '@/domain/website/application/use-cases/users/delete-user.usecase';

import makeUser from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories';
import { randomUUID } from 'crypto';

let usersRepository: InMemoryUsersRepository;
let sut: DeleteUserUseCase;

describe('Delete User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserUseCase(usersRepository);
  });

  it('should be able to delete a user by id', async () => {
    const userAdmin = makeUser({
      role: 'ADMIN',
    });
    await usersRepository.create(userAdmin);
    const loggedUserId = userAdmin.id.toString();
    const loggedUserRole = userAdmin.role;

    const registerUser = makeUser();
    await usersRepository.create(registerUser);

    const result = await sut.execute({
      loggedUserId,
      loggedUserRole,
      userId: registerUser.id.toString(),
    });

    expect(result.isRight()).toEqual(true);
  });

  it("should not be possible to delete a user that doesn't exist", async () => {
    const loggedUserId = randomUUID();
    const loggedUserRole = 'ADMIN';
    const userId = randomUUID();

    const result = await sut.execute({ loggedUserId, loggedUserRole, userId });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be possible to delete a user who is not an administrator', async () => {
    const userFakeAdmin = makeUser();
    await usersRepository.create(userFakeAdmin);
    const loggedUserId = userFakeAdmin.id.toString();
    const loggedUserRole = userFakeAdmin.role;

    const registerUser = makeUser();
    await usersRepository.create(registerUser);

    const result = await sut.execute({
      loggedUserId,
      loggedUserRole,
      userId: registerUser.id.toString(),
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
