import { Either, right } from '@/core/errors';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { PostsRepository } from '@/domain/website/application/repositories';
import { Slug } from '@/domain/website/enterprise/entities/value-objects/slug';
import { PostEntity } from '@/domain/website/enterprise/entities';

export type CreatePostUseCaseRequest = {
  title: string;
  slug?: string;
  excerpt: string;
  coverImage: string;
  content: string;
  seoOverrideId?: string;
  authorId: string;
};

export type CreatePostUseCaseResponse = Either<null, { post: PostEntity }>;

export class CreatePostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    title,
    slug,
    excerpt,
    coverImage,
    content,
    seoOverrideId,
    authorId,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const post = PostEntity.create({
      title,
      slug: slug ? Slug.create(slug) : Slug.createFromText(title),
      excerpt,
      coverImage,
      content,
      seoOverrideId: seoOverrideId
        ? new UniqueEntityID(seoOverrideId)
        : undefined,
      authorId: new UniqueEntityID(authorId),
    });

    await this.postsRepository.create(post);

    return right({
      post,
    });
  }
}
