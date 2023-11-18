import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';

import { NestCreateSeoOverrideUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-create-seo-override.usecase';
import { NestFetchSeoOverridesUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-fetch-seo-overrides.usecase';
import { NestGetSeoOverrideByIdUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-get-seo-override-by-id.usecase';
import { NestEditSeoOverrideUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-edit-seo-override.usecase';
import { NestDeleteSeoOverrideUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-delete-seo-override.usecase';

import { CreateSeoOverrideController } from '@/infra/http/controllers/seo-overrides/create-seo-override.controller';
import { FetchSeoOverridesController } from '@/infra/http/controllers/seo-overrides/fetch-seo-overrides.controller';
import { GetSeoOverrideByIdController } from '@/infra/http/controllers/seo-overrides/get-seo-override-by-id.controller';
import { EditSeoOverrideController } from '@/infra/http/controllers/seo-overrides/edit-seo-override.controller';
import { DeleteUserController } from '@/infra/http/controllers/seo-overrides/delete-seo-override.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateSeoOverrideController,
    FetchSeoOverridesController,
    GetSeoOverrideByIdController,
    EditSeoOverrideController,
    DeleteUserController,
  ],
  providers: [
    NestCreateSeoOverrideUseCase,
    NestFetchSeoOverridesUseCase,
    NestGetSeoOverrideByIdUseCase,
    NestEditSeoOverrideUseCase,
    NestDeleteSeoOverrideUseCase,
  ],
  exports: [
    NestCreateSeoOverrideUseCase,
    NestFetchSeoOverridesUseCase,
    NestGetSeoOverrideByIdUseCase,
    NestEditSeoOverrideUseCase,
    NestDeleteSeoOverrideUseCase,
  ],
})
export class SeoOverridesModule {}
