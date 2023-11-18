import { Injectable } from '@nestjs/common';

import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { FetchSeoOverridesUseCase } from '@/domain/website/application/use-cases/seo-overrides/fetch-seo-overrides.usecase';

@Injectable()
export class NestFetchSeoOverridesUseCase extends FetchSeoOverridesUseCase {
  constructor(seoOverrideRepository: SeoOverridesRepository) {
    super(seoOverrideRepository);
  }
}
