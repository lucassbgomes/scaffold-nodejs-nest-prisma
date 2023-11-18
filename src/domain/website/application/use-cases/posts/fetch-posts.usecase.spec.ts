import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FetchPostsUseCase } from './fetch-posts.usecase';

import { InMemoryPostsRepository } from 'test/repositories';
import makePost from 'test/factories/make-post';

describe('Fetch Posts Use Case', () => {
  let inMemoryRepository: InMemoryPostsRepository;
  let sut: FetchPostsUseCase;

  beforeEach(() => {
    inMemoryRepository = new InMemoryPostsRepository();
    sut = new FetchPostsUseCase(inMemoryRepository);
  });

  it('should be able to fetch many posts', async () => {
    const sizePosts = 3;

    for (let i = 1; i <= sizePosts; i++) {
      await inMemoryRepository.create(
        makePost({}, new UniqueEntityID(`post-id-${i}`)),
      );
    }

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.posts).toHaveLength(sizePosts);
  });

  it('should be able to fetch paginated posts', async () => {
    const sizePosts = 12;

    for (let i = 1; i <= sizePosts; i++) {
      await inMemoryRepository.create(
        makePost({}, new UniqueEntityID(`post-id-${i}`)),
      );
    }

    const result = await sut.execute({ page: 2, size: 10 });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.posts).toHaveLength(2);
  });

  it('should be able to tech no posts', async () => {
    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.posts).toHaveLength(0);
  });
});
