import { FetchParams } from '@/core/types/fetch-params';
import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';

export default class InMemorySeoOverridesRepository
  implements SeoOverridesRepository
{
  public items: SeoOverrideEntity[] = [];

  async findById(id: string): Promise<SeoOverrideEntity | null> {
    const seoOverride = this.items.find((item) => item.id.toString() === id);

    if (!seoOverride) {
      return null;
    }

    return seoOverride;
  }

  async findMany(
    authorId: string,
    { page, size = 20 }: FetchParams,
  ): Promise<SeoOverrideEntity[]> {
    const seoOverrides = this.items
      .filter((item) => item.authorId.toString() === authorId)
      .slice((page - 1) * size, page * size);

    return seoOverrides;
  }

  async create(seoOverride: SeoOverrideEntity) {
    this.items.push(seoOverride);
  }

  async save(seoOverride: SeoOverrideEntity) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === seoOverride.id,
    );

    this.items[itemIndex] = seoOverride;
  }

  async delete(seoOverride: SeoOverrideEntity) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === seoOverride.id,
    );

    this.items.splice(itemIndex, 1);
  }
}
