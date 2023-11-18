import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

import {
  PageQueryParamSchema,
  SizeQueryParamSchema,
  pageQueryValidationPipe,
  sizeQueryValidationPipe,
} from '@/infra/types/zod/common';
import { NestFetchSeoOverridesUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-fetch-seo-overrides.usecase';
import { SeoOverridePresenter } from '@/infra/http/presenters/seo-overrides/seo-override.presenter';
import {
  unauthorizedErrorSwagger,
  sizeQueryParamSwagger,
  pageQueryParamSwagger,
} from '@/infra/types/swagger/common';
import { fetchSeoOverridesSwagger } from '@/infra/types/swagger/seo-overrides';

@ApiBearerAuth()
@ApiTags('Seo Overrides')
@Controller('/seo-overrides')
export class FetchSeoOverridesController {
  constructor(private fetchSeoOverrides: NestFetchSeoOverridesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Fetch seo override by author' })
  @ApiResponse(fetchSeoOverridesSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiQuery(sizeQueryParamSwagger)
  @ApiQuery(pageQueryParamSwagger)
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
