import { ResourceNotFoundError } from '@/core/errors';

import { GetSeoOverrideByIdUseCase } from './get-seo-override-by-id.usecase';

import { InMemorySeoOverridesRepository } from 'test/repositories';
import makeSeoOverride from 'test/factories/make-seo-override';

describe('Get SeoOverride By Id Use Case', () => {
  let inMemoryRepository: InMemorySeoOverridesRepository;
  let sut: GetSeoOverrideByIdUseCase;

  beforeAll(async () => {
    inMemoryRepository = new InMemorySeoOverridesRepository();
    sut = new GetSeoOverrideByIdUseCase(inMemoryRepository);
  });

  it('should be able get a seo override by id', async () => {
    const seoOverride = makeSeoOverride();

    await inMemoryRepository.create(seoOverride);

    const result = await sut.execute({
      seoOverrideId: seoOverride.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        seoOverride: expect.objectContaining({ title: expect.any(String) }),
      }),
    );
  });

  it('should not be able get a non-existent seo override', async () => {
    const seoOverride = makeSeoOverride();

    const result = await sut.execute({
      seoOverrideId: seoOverride.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
