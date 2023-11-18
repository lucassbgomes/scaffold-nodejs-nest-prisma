import { Injectable } from '@nestjs/common';

import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { CreateSeoOverrideUseCase } from '@/domain/website/application/use-cases/seo-overrides/create-seo-override.usecase';

@Injectable()
export class NestCreateSeoOverrideUseCase extends CreateSeoOverrideUseCase {
  constructor(seoOverrideRepository: SeoOverridesRepository) {
    super(seoOverrideRepository);
  }
}
