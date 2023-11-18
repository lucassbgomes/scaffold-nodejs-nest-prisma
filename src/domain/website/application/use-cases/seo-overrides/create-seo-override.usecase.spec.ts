import { CreateSeoOverrideUseCase } from './create-seo-override.usecase';

import { InMemorySeoOverridesRepository } from 'test/repositories';
import makeUser from 'test/factories/make-user';
import makeSeoOverride from 'test/factories/make-seo-override';

describe('Create Seo Override Use Case', () => {
  let inMemoryRepository: InMemorySeoOverridesRepository;
  let sut: CreateSeoOverrideUseCase;

  beforeAll(() => {
    inMemoryRepository = new InMemorySeoOverridesRepository();
    sut = new CreateSeoOverrideUseCase(inMemoryRepository);
  });

  it('should be able to create a seo override', async () => {
    const user = makeUser();

    const seoOverride = makeSeoOverride({ authorId: user.id });

    const { isRight, value } = await sut.execute({
      title: seoOverride.title,
      description: seoOverride.description,
      image: seoOverride.image,
      authorId: seoOverride.authorId.toString(),
    });

    expect(isRight()).toBeTruthy();
    expect(inMemoryRepository.items[0]).toEqual(value?.seoOverride);
  });
});
