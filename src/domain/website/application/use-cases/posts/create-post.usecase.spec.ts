import { CreatePostUseCase } from './create-post.usecase';

import { InMemoryPostsRepository } from 'test/repositories';
import makeUser from 'test/factories/make-user';
import makePost from 'test/factories/make-post';
import makeSeoOverride from 'test/factories/make-seo-override';

describe('Create Post Use Case', () => {
  let inMemoryRepository: InMemoryPostsRepository;
  let sut: CreatePostUseCase;

  beforeEach(() => {
    inMemoryRepository = new InMemoryPostsRepository();

    sut = new CreatePostUseCase(inMemoryRepository);
  });

  it('should be able to create a post', async () => {
    const user = makeUser();

    const { title, slug, coverImage, excerpt, content, authorId } = makePost({
      authorId: user.id,
    });

    const { isLeft, isRight, value } = await sut.execute({
      title,
      slug: slug.value,
      coverImage,
      excerpt,
      content,
      authorId: authorId.toString(),
    });

    expect(isRight()).toEqual(true);
    expect(isLeft()).toEqual(false);
    expect(inMemoryRepository.items[0]).toEqual(value?.post);
  });

  it('should be able to create a post with seo override', async () => {
    const user = makeUser();

    const seoOverride = makeSeoOverride();

    const {
      title,
      slug,
      coverImage,
      excerpt,
      content,
      authorId,
      seoOverrideId,
    } = makePost({
      authorId: user.id,
      seoOverrideId: seoOverride.id,
    });

    const { isLeft, isRight, value } = await sut.execute({
      title,
      slug: slug.value,
      coverImage,
      excerpt,
      content,
      authorId: authorId.toString(),
      seoOverrideId: seoOverrideId?.toString(),
    });

    expect(isRight()).toEqual(true);
    expect(isLeft()).toEqual(false);
    expect(inMemoryRepository.items[0].seoOverrideId).toEqual(seoOverride.id);
    expect(inMemoryRepository.items[0]).toEqual(value?.post);
  });
});
