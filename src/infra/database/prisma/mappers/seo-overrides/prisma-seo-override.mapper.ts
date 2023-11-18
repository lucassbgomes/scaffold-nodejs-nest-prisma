import { SeoOverride, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';

export class PrismaSeoOverrideMapper {
  static toDomain(raw: SeoOverride): SeoOverrideEntity {
    return SeoOverrideEntity.create(
      {
        title: raw.title,
        image: raw.image,
        description: raw.description,
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    raw: SeoOverrideEntity,
  ): Prisma.SeoOverrideUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      title: raw.title,
      image: raw.image,
      description: raw.description,
      authorId: raw.authorId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
