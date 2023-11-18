import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { ResourceNotFoundError } from '@/core/errors';

import { NestGetSeoOverrideByIdUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-get-seo-override-by-id.usecase';
import { SeoOverridePresenter } from '@/infra/http/presenters/seo-overrides/seo-override.presenter';

@Controller('/seo-overrides/:seoOverrideId')
export class GetSeoOverrideByIdController {
  constructor(private getSeoOverrideById: NestGetSeoOverrideByIdUseCase) {}

  @Get()
  async handle(@Param('seoOverrideId') seoOverrideId: string) {
    const result = await this.getSeoOverrideById.execute({
      seoOverrideId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            error: 'ResourceNotFoundError',
            message: error.message,
          });
        default:
          throw new BadRequestException({
            error: error.name,
            message: error.message,
          });
      }
    }

    const { seoOverride } = result.value;

    return {
      seoOverride: SeoOverridePresenter.toJson(seoOverride),
    };
  }
}
