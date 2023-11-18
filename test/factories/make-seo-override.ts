import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';
import { SeoOverrideEntityProps } from '@/domain/website/enterprise/entities/seo-override/seo-override.types';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaSeoOverrideMapper } from '@/infra/database/prisma/mappers/seo-overrides/prisma-seo-override.mapper';

export default function makeSeoOverride(
  override: Partial<SeoOverrideEntityProps> = {},
  id?: UniqueEntityID,
) {
  const seoOverride = SeoOverrideEntity.create(
    {
      title: faker.person.firstName(),
      description: faker.lorem.text(),
      image: faker.image.url(),
      authorId: new UniqueEntityID('new-seo-override'),
      ...override,
    },
    id,
  );

  return seoOverride;
}

@Injectable()
export class SeoOverrideFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSeoOverride(
    data: Partial<SeoOverrideEntityProps> = {},
  ): Promise<SeoOverrideEntity> {
    const seoOverride = makeSeoOverride(data);

    await this.prisma.seoOverride.create({
      data: PrismaSeoOverrideMapper.toPrisma(seoOverride),
    });

    return seoOverride;
  }
}
