import { Injectable } from '@nestjs/common';

import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { GetSeoOverrideByIdUseCase } from '@/domain/website/application/use-cases/seo-overrides/get-seo-override-by-id.usecase';

@Injectable()
export class NestGetSeoOverrideByIdUseCase extends GetSeoOverrideByIdUseCase {
  constructor(seoOverrideRepository: SeoOverridesRepository) {
    super(seoOverrideRepository);
  }
}
