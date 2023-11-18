import { Either, right } from '@/core/errors';
import { FetchParams } from '@/core/types/fetch-params';

import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';

export type FetchSeoOverridesUseCaseRequest = {
  authorId: string;
  params: FetchParams;
};

export type FetchSeoOverridesUseCaseResponse = Either<
  null,
  { seoOverrides: SeoOverrideEntity[] }
>;

export class FetchSeoOverridesUseCase {
  constructor(private seoOverridesRepository: SeoOverridesRepository) {}

  async execute({
    authorId,
    params,
  }: FetchSeoOverridesUseCaseRequest): Promise<FetchSeoOverridesUseCaseResponse> {
    const { page, size } = params;

    const seoOverrides = await this.seoOverridesRepository.findMany(authorId, {
      page,
      size,
    });

    return right({
      seoOverrides,
    });
  }
}
