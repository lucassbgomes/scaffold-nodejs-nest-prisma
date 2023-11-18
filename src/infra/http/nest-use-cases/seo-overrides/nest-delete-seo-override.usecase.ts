import { Injectable } from '@nestjs/common';

import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { DeleteSeoOverrideUseCase } from '@/domain/website/application/use-cases/seo-overrides/delete-seo-override.usecase';

@Injectable()
export class NestDeleteSeoOverrideUseCase extends DeleteSeoOverrideUseCase {
  constructor(seoOverrideRepository: SeoOverridesRepository) {
    super(seoOverrideRepository);
  }
}
