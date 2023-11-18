import { Post, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PostEntity } from '@/domain/website/enterprise/entities';
import { Slug } from '@/domain/website/enterprise/entities/value-objects/slug';

export class PrismaPostMapper {
  static toDomain(raw: Post): PostEntity {
    return PostEntity.create(
      {
        title: raw.title,
        slug: Slug.create(raw.slug),
        excerpt: raw.excerpt,
        coverImage: raw.coverImage,
        content: raw.content,
        seoOverrideId: raw.seoOverrideId
          ? new UniqueEntityID(raw.seoOverrideId)
          : undefined,
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: PostEntity): Prisma.PostUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      title: raw.title,
      slug: raw.slug.value,
      excerpt: raw.excerpt,
      coverImage: raw.coverImage,
      content: raw.content,
      seoOverrideId: raw.seoOverrideId?.toString(),
      authorId: raw.authorId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
