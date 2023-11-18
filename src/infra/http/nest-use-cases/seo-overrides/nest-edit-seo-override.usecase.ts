import { Injectable } from '@nestjs/common';

import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { EditSeoOverrideUseCase } from '@/domain/website/application/use-cases/seo-overrides/edit-seo-override.usecase';

@Injectable()
export class NestEditSeoOverrideUseCase extends EditSeoOverrideUseCase {
  constructor(seoOverrideRepository: SeoOverridesRepository) {
    super(seoOverrideRepository);
  }
}
