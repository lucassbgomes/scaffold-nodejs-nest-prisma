import { Injectable } from '@nestjs/common';

import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';

import { PrismaSeoOverrideMapper } from '@/infra/database/prisma/mappers/seo-overrides/prisma-seo-override.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { FetchParams } from '@/core/types/fetch-params';

@Injectable()
export class PrismaSeoOverridesRepository implements SeoOverridesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<SeoOverrideEntity | null> {
    const seoOverride = await this.prisma.seoOverride.findUnique({
      where: { id },
    });

    if (!seoOverride) {
      return null;
    }

    return PrismaSeoOverrideMapper.toDomain(seoOverride);
  }

  async findMany(
    authorId: string,
    { page, size = 20 }: FetchParams,
  ): Promise<SeoOverrideEntity[]> {
    const seoOverrides = await this.prisma.seoOverride.findMany({
      where: {
        authorId,
      },
      take: size,
      skip: (page - 1) * size,
    });

    return seoOverrides.map(PrismaSeoOverrideMapper.toDomain);
  }

  async create(seoOverride: SeoOverrideEntity) {
    const data = PrismaSeoOverrideMapper.toPrisma(seoOverride);

    await this.prisma.seoOverride.create({ data });
  }

  async save(seoOverride: SeoOverrideEntity) {
    const data = PrismaSeoOverrideMapper.toPrisma(seoOverride);

    await this.prisma.seoOverride.update({
      where: {
        id: seoOverride.id.toString(),
      },
      data,
    });
  }

  async delete({ id }: SeoOverrideEntity) {
    await this.prisma.seoOverride.delete({
      where: {
        id: id.toString(),
      },
    });
  }
}
