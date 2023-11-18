import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { NestCreateSeoOverrideUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-create-seo-override.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import {
  CreateSeoOverrideRequest,
  createSeoOverrideSchema,
} from '@/infra/types/zod/seo-overrides';

import { CurrentUser } from '@/infra/auth/create-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  noContent201ResponseSwagger,
  unauthorizedErrorSwagger,
} from '@/infra/types/swagger/common';
import { CreateSeoOverrideSwagger } from '@/infra/types/swagger/seo-overrides';

const bodyValidationPipe = new ZodValidationPipe(createSeoOverrideSchema);

@ApiBearerAuth()
@ApiTags('Seo Overrides')
@Controller('/seo-overrides')
export class CreateSeoOverrideController {
  constructor(private createSeoOverride: NestCreateSeoOverrideUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a seo override' })
  @ApiBody({ type: CreateSeoOverrideSwagger })
  @ApiResponse(noContent201ResponseSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateSeoOverrideRequest,
    @CurrentUser() userLogged: UserPayload,
  ) {
    const authorId = userLogged.sub;

    await this.createSeoOverride.execute({ authorId, ...body });
  }
}
