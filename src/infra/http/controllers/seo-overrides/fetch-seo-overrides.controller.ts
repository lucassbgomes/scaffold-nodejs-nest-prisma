import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  PageQueryParamSchema,
  SizeQueryParamSchema,
  pageQueryValidationPipe,
  sizeQueryValidationPipe,
} from '@/infra/types/zod/common';
import { NestFetchSeoOverridesUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-fetch-seo-overrides.usecase';
import { SeoOverridePresenter } from '@/infra/http/presenters/seo-overrides/seo-override.presenter';

@Controller('/seo-overrides')
export class FetchSeoOverridesController {
  constructor(private fetchSeoOverrides: NestFetchSeoOverridesUseCase) {}

  @Get()
  async handle(
    @Param('authorId') authorId: string,
    @Query('size', sizeQueryValidationPipe) size: SizeQueryParamSchema,
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { value } = await this.fetchSeoOverrides.execute({
      authorId,
      params: {
        page: page ?? 1,
        size,
      },
    });

    const seoOverrides =
      value?.seoOverrides.map(SeoOverridePresenter.toJson) ?? [];

    return {
      seoOverrides,
    };
  }
}
