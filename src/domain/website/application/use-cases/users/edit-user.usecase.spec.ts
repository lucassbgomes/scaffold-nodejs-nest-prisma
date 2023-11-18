import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';

import { EditUserUseCase } from '@/domain/website/application/use-cases/users/edit-user.usecase';
import { randomUUID } from 'crypto';
import { FakeHasher } from 'test/cryptography/fake-hasher';

import makeUser from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories';

let usersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: EditUserUseCase;

describe('Edit User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new EditUserUseCase(usersRepository, fakeHasher);
  });

  it('should be able to edit a user', async () => {
    const registerUser = makeUser();

    await usersRepository.create(registerUser);

    const result = await sut.execute({
      loggedUserId: registerUser.id.toString(),
      loggedUserRole: registerUser.role,
      userId: registerUser.id.toString(),
      data: { firstName: 'Name Edited' },
    });

    expect(result.isRight()).toEqual(true);
    expect(usersRepository.items[0].firstName).toEqual('Name Edited');
  });

  it('should be possible to edit email or username if the user is an administrator', async () => {
    const registerUser = makeUser({ role: 'ADMIN' });
    await usersRepository.create(registerUser);

    const email = 'lucas@gomes.eti.br';
    const username = 'lucasgomes';

    const result = await sut.execute({
      loggedUserId: registerUser.id.toString(),
      loggedUserRole: registerUser.role,
      userId: registerUser.id.toString(),
      data: { email, username },
    });

    expect(result.isRight()).toEqual(true);
    expect(usersRepository.items[0].email).toEqual(email);
    expect(usersRepository.items[0].username).toEqual(username);
  });

  it('should not be able editing email or username if you are not admin', async () => {
    const email = 'lucas@gomes.eti.br';
    const username = 'lucasgomes';

    const registerUser = makeUser({ email, username });

    await usersRepository.create(registerUser);

    const result = await sut.execute({
      loggedUserId: registerUser.id.toString(),
      loggedUserRole: registerUser.role,
      userId: registerUser.id.toString(),
      data: {
        email: 'lucas@gmail.com',
        username: 'lucas.gomes',
      },
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(usersRepository.items[0].email).toEqual(email);
    expect(usersRepository.items[0].username).toEqual(username);
  });

  it("should not be possible to edit a user that doesn't exist", async () => {
    const result = await sut.execute({
      loggedUserId: 'id-inexistent-admin',
      loggedUserRole: 'ADMIN',
      userId: `${randomUUID()}`,
      data: {},
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
