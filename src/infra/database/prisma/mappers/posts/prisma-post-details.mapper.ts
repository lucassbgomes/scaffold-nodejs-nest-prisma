import { Post, SeoOverride, User } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Slug } from '@/domain/website/enterprise/entities/value-objects/slug';
import { PrismaSeoOverrideMapper } from '../seo-overrides/prisma-seo-override.mapper';
import { PrismaUserMapper } from '../users/prisma-user.mapper';
import { PostDetails } from '@/domain/website/enterprise/entities/post/value-objects/post-details';

type PrismaPostDetails = Post & {
  seoOverride: SeoOverride | null;
  author: User;
};

export class PrismaPostDetailsMapper {
  static toDomain(raw: PrismaPostDetails): PostDetails {
    return PostDetails.create({
      id: new UniqueEntityID(raw.id),
      title: raw.title,
      slug: Slug.create(raw.slug),
      excerpt: raw.excerpt,
      coverImage: raw.coverImage,
      content: raw.content,
      seoOverride:
        raw.seoOverride && PrismaSeoOverrideMapper.toDomain(raw.seoOverride),
      author: PrismaUserMapper.toDomain(raw.author),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
