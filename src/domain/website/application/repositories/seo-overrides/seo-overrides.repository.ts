import { FetchParams } from '@/core/types/fetch-params';

import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';

export default abstract class SeoOverridesRepository {
  abstract findById(id: string): Promise<SeoOverrideEntity | null>;

  abstract findMany(
    authorId: string,
    params: FetchParams,
  ): Promise<SeoOverrideEntity[]>;

  abstract create(data: SeoOverrideEntity): Promise<void>;

  abstract save(data: SeoOverrideEntity): Promise<void>;

  abstract delete(data: SeoOverrideEntity): Promise<void>;
}
