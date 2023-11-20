import { ResourceNotFoundError } from '@/core/errors';

import { GetPostDetailsUseCase } from './get-post-details.usecase';

import {
  InMemoryPostsRepository,
  InMemorySeoOverridesRepository,
  InMemoryUsersRepository,
} from 'test/repositories';
import makePost from 'test/factories/make-post';
import makeUser from 'test/factories/make-user';
import makeSeoOverride from 'test/factories/make-seo-override';

describe('Get Post Details Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let seoOverrideRepository: InMemorySeoOverridesRepository;
  let inMemoryRepository: InMemoryPostsRepository;
  let sut: GetPostDetailsUseCase;

  beforeAll(async () => {
    seoOverrideRepository = new InMemorySeoOverridesRepository();
    usersRepository = new InMemoryUsersRepository();
    inMemoryRepository = new InMemoryPostsRepository(
      usersRepository,
      seoOverrideRepository,
    );
    sut = new GetPostDetailsUseCase(inMemoryRepository);
  });

  it('should be able get details a post by id', async () => {
    const user = makeUser();
    const seoOverride = makeSeoOverride({ authorId: user.id });
    const post = makePost({ seoOverrideId: seoOverride.id, authorId: user.id });

    await usersRepository.create(user);
    await seoOverrideRepository.create(seoOverride);
    await inMemoryRepository.create(post);

    const result = await sut.execute({ postId: post.id.toString() });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        post: expect.objectContaining({
          title: expect.any(String),
          seoOverride: expect.objectContaining({ id: seoOverride.id }),
          author: expect.objectContaining({ id: user.id }),
        }),
      }),
    );
  });

  it('should not be able get details a non-existent post', async () => {
    const post = makePost();

    const result = await sut.execute({ postId: post.id.toString() });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
