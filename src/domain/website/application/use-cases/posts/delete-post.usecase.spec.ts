import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';

import { DeletePostUseCase } from './delete-post.usecase';

import makePost from 'test/factories/make-post';
import { InMemoryPostsRepository } from 'test/repositories';
import makeUser from 'test/factories/make-user';

describe('Delete Post Use Case', () => {
  let inMemoryRepository: InMemoryPostsRepository;
  let sut: DeletePostUseCase;

  beforeAll(() => {
    inMemoryRepository = new InMemoryPostsRepository();
    sut = new DeletePostUseCase(inMemoryRepository);
  });

  it('should be able to delete a post', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: user.id });

    await inMemoryRepository.create(post);

    const result = await sut.execute({
      loggedUserId: user.id.toString(),
      loggedUserRole: user.role,
      postId: post.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeNull();

    const postFound = await inMemoryRepository.findById(post.id.toString());

    expect(postFound).toBeNull();
  });

  it('should be able to delete a post with user admin', async () => {
    const userAdmin = makeUser({ role: 'ADMIN' });
    const userClient = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: userClient.id });

    await inMemoryRepository.create(post);

    const result = await sut.execute({
      loggedUserId: userAdmin.id.toString(),
      loggedUserRole: userAdmin.role,
      postId: post.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeNull();

    const postFound = await inMemoryRepository.findById(post.id.toString());

    expect(postFound).toBeNull();
  });

  it('should not be able to delete a post that is not from the user, or admin, or manager', async () => {
    const userSupport = makeUser({ role: 'SUPPORT' });
    const userClient = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: userClient.id });

    await inMemoryRepository.create(post);

    const result = await sut.execute({
      loggedUserId: userSupport.id.toString(),
      loggedUserRole: userSupport.role,
      postId: post.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete a non-existent post', async () => {
    const userClient = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: userClient.id });

    const result = await sut.execute({
      loggedUserId: userClient.id.toString(),
      loggedUserRole: userClient.role,
      postId: post.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
