import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';

import { DeleteSeoOverrideUseCase } from './delete-seo-override.usecase';

import { InMemorySeoOverridesRepository } from 'test/repositories';
import makeUser from 'test/factories/make-user';
import makeSeoOverride from 'test/factories/make-seo-override';

describe('Delete Seo Override Use Case', () => {
  let inMemoryRepository: InMemorySeoOverridesRepository;
  let sut: DeleteSeoOverrideUseCase;

  beforeAll(() => {
    inMemoryRepository = new InMemorySeoOverridesRepository();
    sut = new DeleteSeoOverrideUseCase(inMemoryRepository);
  });

  it('should be able to delete a seo override', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({ authorId: user.id });

    await inMemoryRepository.create(seoOverride);

    const result = await sut.execute({
      loggedUserId: user.id.toString(),
      loggedUserRole: user.role,
      seoOverrideId: seoOverride.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeNull();
  });

  it('should be able to delete a seo override with user admin', async () => {
    const userAdmin = makeUser({ role: 'ADMIN' });
    const userClient = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({ authorId: userClient.id });

    await inMemoryRepository.create(seoOverride);

    const result = await sut.execute({
      loggedUserId: userAdmin.id.toString(),
      loggedUserRole: userAdmin.role,
      seoOverrideId: seoOverride.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeNull();

    const seoOverrideFound = await inMemoryRepository.findById(
      seoOverride.id.toString(),
    );

    expect(seoOverrideFound).toBeNull();
  });

  it('should not be able to delete a seo override that is not from the user, or admin, or manager', async () => {
    const userSupport = makeUser({ role: 'SUPPORT' });
    const userClient = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({ authorId: userClient.id });

    await inMemoryRepository.create(seoOverride);

    const result = await sut.execute({
      loggedUserId: userSupport.id.toString(),
      loggedUserRole: userSupport.role,
      seoOverrideId: seoOverride.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete a non-existent seoOverride', async () => {
    const userClient = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({ authorId: userClient.id });

    const result = await sut.execute({
      loggedUserId: userClient.id.toString(),
      loggedUserRole: userClient.role,
      seoOverrideId: seoOverride.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
