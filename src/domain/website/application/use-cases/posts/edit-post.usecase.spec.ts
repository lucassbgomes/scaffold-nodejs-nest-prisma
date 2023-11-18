import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';

import { EditPostUseCase } from './edit-post.usecase';

import { InMemoryPostsRepository } from 'test/repositories';
import makeUser from 'test/factories/make-user';
import makePost from 'test/factories/make-post';

describe('Edit Post Use Case', () => {
  let inMemoryRepository: InMemoryPostsRepository;
  let sut: EditPostUseCase;

  beforeAll(async () => {
    inMemoryRepository = new InMemoryPostsRepository();
    sut = new EditPostUseCase(inMemoryRepository);
  });

  it('should be able to edit a post that is from the user himself, without being an admin or manager', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: user.id });

    await inMemoryRepository.create(post);

    const { isRight, value } = await sut.execute({
      loggedUserId: user.id.toString(),
      loggedUserRole: user.role,
      postId: post.id.toString(),
      data: { title: 'Title edited', authorId: post.authorId.toString() },
    });

    expect(isRight()).toBeTruthy();
    expect(value).toEqual({
      post: expect.objectContaining({ title: expect.any(String) }),
    });

    const postFound = await inMemoryRepository.findById(post.id.toString());

    expect(postFound?.title).toEqual('Title edited');
  });

  it('should not be able to edit a post with user admin', async () => {
    const userAdmin = makeUser({ role: 'ADMIN' });
    const userClient = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: userClient.id });

    await inMemoryRepository.create(post);

    const { isRight, value } = await sut.execute({
      loggedUserId: userAdmin.id.toString(),
      loggedUserRole: userAdmin.role,
      postId: post.id.toString(),
      data: { title: 'Title edited', authorId: post.authorId.toString() },
    });

    expect(isRight()).toBeTruthy();
    expect(value).toEqual({
      post: expect.objectContaining({ title: expect.any(String) }),
    });

    const postFound = await inMemoryRepository.findById(post.id.toString());

    expect(postFound?.title).toEqual('Title edited');
  });

  it('should not be able to edit a post with user manager', async () => {
    const userManager = makeUser({ role: 'MANAGER' });
    const userClient = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: userClient.id });

    await inMemoryRepository.create(post);

    const { isRight, value } = await sut.execute({
      loggedUserId: userManager.id.toString(),
      loggedUserRole: userManager.role,
      postId: post.id.toString(),
      data: { title: 'Title edited', authorId: post.authorId.toString() },
    });

    expect(isRight()).toBeTruthy();
    expect(value).toEqual({
      post: expect.objectContaining({ title: expect.any(String) }),
    });

    const postFound = await inMemoryRepository.findById(post.id.toString());

    expect(postFound?.title).toEqual('Title edited');
  });

  it('should not be able to edit a post that is not from the user, or admin, or manager', async () => {
    const userSupport = makeUser({ role: 'SUPPORT' });
    const userClient = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: userClient.id, title: 'Title post' });

    await inMemoryRepository.create(post);

    const { isLeft, value } = await sut.execute({
      loggedUserId: userSupport.id.toString(),
      loggedUserRole: userSupport.role,
      postId: post.id.toString(),
      data: { title: 'Title edited', authorId: post.authorId.toString() },
    });

    expect(isLeft()).toBeTruthy();
    expect(value).toBeInstanceOf(NotAllowedError);

    const postFound = await inMemoryRepository.findById(post.id.toString());

    expect(postFound?.title).toEqual('Title post');
  });

  it('should not be able to edit a non-existent post', async () => {
    const userClient = makeUser({ role: 'CLIENT' });

    const post = makePost({ authorId: userClient.id });

    const { isLeft, value } = await sut.execute({
      loggedUserId: userClient.id.toString(),
      loggedUserRole: userClient.role,
      postId: post.id.toString(),
      data: { title: 'Title edited', authorId: post.authorId.toString() },
    });

    expect(isLeft()).toBeTruthy();
    expect(value).toBeInstanceOf(ResourceNotFoundError);
  });
});
