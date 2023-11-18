import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { NestCreateSeoOverrideUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-create-seo-override.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import {
  CreateSeoOverrideRequest,
  createSeoOverrideSchema,
} from '@/infra/types/zod/seo-overrides';

import { CurrentUser } from '@/infra/auth/create-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';

const bodyValidationPipe = new ZodValidationPipe(createSeoOverrideSchema);

@Controller('/seo-overrides')
export class CreateSeoOverrideController {
  constructor(private createSeoOverride: NestCreateSeoOverrideUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateSeoOverrideRequest,
    @CurrentUser() userLogged: UserPayload,
  ) {
    const authorId = userLogged.sub;

    await this.createSeoOverride.execute({ authorId, ...body });
  }
}
