import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { ResourceNotFoundError } from '@/core/errors';

import { NestGetSeoOverrideByIdUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-get-seo-override-by-id.usecase';
import { SeoOverridePresenter } from '@/infra/http/presenters/seo-overrides/seo-override.presenter';
import {
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
} from '@/infra/types/swagger/common';
import { getSeoOverrideByIdSwagger } from '@/infra/types/swagger/seo-overrides';

@ApiBearerAuth()
@ApiTags('Seo Overrides')
@Controller('/seo-overrides/:seoOverrideId')
export class GetSeoOverrideByIdController {
  constructor(private getSeoOverrideById: NestGetSeoOverrideByIdUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get a seo override by id' })
  @ApiResponse(getSeoOverrideByIdSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
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
