import { ResourceNotFoundError } from '@/core/errors';

import { GetPostByIdUseCase } from './get-post-by-id.usecase';

import { InMemoryPostsRepository } from 'test/repositories';
import makePost from 'test/factories/make-post';

describe('Get Post By Id Use Case', () => {
  let inMemoryRepository: InMemoryPostsRepository;
  let sut: GetPostByIdUseCase;

  beforeAll(async () => {
    inMemoryRepository = new InMemoryPostsRepository();
    sut = new GetPostByIdUseCase(inMemoryRepository);
  });

  it('should be able get a post by id', async () => {
    const post = makePost();

    await inMemoryRepository.create(post);

    const result = await sut.execute({ postId: post.id.toString() });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        post: expect.objectContaining({ title: expect.any(String) }),
      }),
    );
  });

  it('should not be able get a non-existent post', async () => {
    const post = makePost();

    const result = await sut.execute({ postId: post.id.toString() });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
