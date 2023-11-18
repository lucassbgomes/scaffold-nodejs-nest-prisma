import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';

import { EditSeoOverrideUseCase } from './edit-seo-override.usecase';

import { InMemorySeoOverridesRepository } from 'test/repositories';
import makeUser from 'test/factories/make-user';
import makeSeoOverride from 'test/factories/make-seo-override';

describe('Edit Post Use Case', () => {
  let inMemoryRepository: InMemorySeoOverridesRepository;
  let sut: EditSeoOverrideUseCase;

  beforeAll(async () => {
    inMemoryRepository = new InMemorySeoOverridesRepository();
    sut = new EditSeoOverrideUseCase(inMemoryRepository);
  });

  it('should be able to edit a seo override that is from the user himself, without being an admin or manager', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({ authorId: user.id });

    await inMemoryRepository.create(seoOverride);

    const { isRight, value } = await sut.execute({
      loggedUserId: user.id.toString(),
      loggedUserRole: user.role,
      seoOverrideId: seoOverride.id.toString(),
      data: {
        title: 'Title edited',
      },
    });

    expect(isRight()).toBeTruthy();
    expect(value).toEqual({
      seoOverride: expect.objectContaining({ title: expect.any(String) }),
    });

    const seoOverrideFound = await inMemoryRepository.findById(
      seoOverride.id.toString(),
    );

    expect(seoOverrideFound?.title).toEqual('Title edited');
  });

  it('should not be able to edit a seo override with user admin', async () => {
    const userAdmin = makeUser({ role: 'ADMIN' });
    const userClient = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({ authorId: userClient.id });

    await inMemoryRepository.create(seoOverride);

    const { isRight, value } = await sut.execute({
      loggedUserId: userAdmin.id.toString(),
      loggedUserRole: userAdmin.role,
      seoOverrideId: seoOverride.id.toString(),
      data: {
        title: 'Title edited',
      },
    });

    expect(isRight()).toBeTruthy();
    expect(value).toEqual({
      seoOverride: expect.objectContaining({ title: expect.any(String) }),
    });

    const seoOverrideFound = await inMemoryRepository.findById(
      seoOverride.id.toString(),
    );

    expect(seoOverrideFound?.title).toEqual('Title edited');
  });

  it('should not be able to edit a seo override with user manager', async () => {
    const userManager = makeUser({ role: 'MANAGER' });
    const userClient = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({ authorId: userClient.id });

    await inMemoryRepository.create(seoOverride);

    const { isRight, value } = await sut.execute({
      loggedUserId: userManager.id.toString(),
      loggedUserRole: userManager.role,
      seoOverrideId: seoOverride.id.toString(),
      data: {
        title: 'Title edited',
      },
    });

    expect(isRight()).toBeTruthy();
    expect(value).toEqual({
      seoOverride: expect.objectContaining({ title: expect.any(String) }),
    });

    const seoOverrideFound = await inMemoryRepository.findById(
      seoOverride.id.toString(),
    );

    expect(seoOverrideFound?.title).toEqual('Title edited');
  });

  it('should not be able to edit a seo override that is not from the user, or admin, or manager', async () => {
    const userSupport = makeUser({ role: 'SUPPORT' });
    const userClient = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({
      authorId: userClient.id,
      title: 'Title seoOverride',
    });

    await inMemoryRepository.create(seoOverride);

    const { isLeft, value } = await sut.execute({
      loggedUserId: userSupport.id.toString(),
      loggedUserRole: userSupport.role,
      seoOverrideId: seoOverride.id.toString(),
      data: {
        title: 'Title edited',
      },
    });

    expect(isLeft()).toBeTruthy();
    expect(value).toBeInstanceOf(NotAllowedError);

    const seoOverrideFound = await inMemoryRepository.findById(
      seoOverride.id.toString(),
    );

    expect(seoOverrideFound?.title).toEqual('Title seoOverride');
  });

  it('should not be able to edit a non-existent seoOverride', async () => {
    const userClient = makeUser({ role: 'CLIENT' });

    const seoOverride = makeSeoOverride({ authorId: userClient.id });

    const { isLeft, value } = await sut.execute({
      loggedUserId: userClient.id.toString(),
      loggedUserRole: userClient.role,
      seoOverrideId: seoOverride.id.toString(),
      data: {
        title: 'Title edited',
      },
    });

    expect(isLeft()).toBeTruthy();
    expect(value).toBeInstanceOf(ResourceNotFoundError);
  });
});
