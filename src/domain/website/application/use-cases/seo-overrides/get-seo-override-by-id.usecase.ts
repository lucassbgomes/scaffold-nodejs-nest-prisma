import { Either, ResourceNotFoundError, left, right } from '@/core/errors';

import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';
import { SeoOverridesRepository } from '@/domain/website/application/repositories';

export type GetSeoOverrideByIdUseCaseRequest = {
  seoOverrideId: string;
};

export type GetSeoOverrideByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { seoOverride: SeoOverrideEntity }
>;

export class GetSeoOverrideByIdUseCase {
  constructor(private seoOverridesRepository: SeoOverridesRepository) {}

  async execute({
    seoOverrideId,
  }: GetSeoOverrideByIdUseCaseRequest): Promise<GetSeoOverrideByIdUseCaseResponse> {
    const seoOverride =
      await this.seoOverridesRepository.findById(seoOverrideId);

    if (!seoOverride) {
      return left(new ResourceNotFoundError());
    }

    return right({
      seoOverride,
    });
  }
}
