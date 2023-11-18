import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FetchSeoOverridesUseCase } from './fetch-seo-overrides.usecase';

import { InMemorySeoOverridesRepository } from 'test/repositories';
import makeSeoOverride from 'test/factories/make-seo-override';
import makeUser from 'test/factories/make-user';

describe('Fetch SeoOverrides Use Case', () => {
  let inMemoryRepository: InMemorySeoOverridesRepository;
  let sut: FetchSeoOverridesUseCase;

  beforeEach(() => {
    inMemoryRepository = new InMemorySeoOverridesRepository();
    sut = new FetchSeoOverridesUseCase(inMemoryRepository);
  });

  it('should be able to fetch many seo overrides', async () => {
    const sizeSeoOverrides = 3;

    const user = makeUser();

    for (let i = 1; i <= sizeSeoOverrides; i++) {
      await inMemoryRepository.create(
        makeSeoOverride(
          { authorId: user.id },
          new UniqueEntityID(`seo-override-id-${i}`),
        ),
      );
    }

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: { page: 1 },
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.seoOverrides).toHaveLength(sizeSeoOverrides);
  });

  it('should be able to fetch paginated seo overrides', async () => {
    const sizeSeoOverrides = 12;

    const user = makeUser();

    for (let i = 1; i <= sizeSeoOverrides; i++) {
      await inMemoryRepository.create(
        makeSeoOverride(
          { authorId: user.id },
          new UniqueEntityID(`seo-override-id-${i}`),
        ),
      );
    }

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: { page: 2, size: 10 },
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.seoOverrides).toHaveLength(2);
  });

  it('should be able to fetch no seo overrides', async () => {
    const user = makeUser();

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: { page: 1 },
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.seoOverrides).toHaveLength(0);
  });
});
