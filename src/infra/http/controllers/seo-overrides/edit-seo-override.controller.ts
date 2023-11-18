import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { NotAllowedError } from '@/core/errors';
import { errorNotAllowed } from '@/core/errors/reason/not-allowed.error';

import { CurrentUser } from '@/infra/auth/create-user.decorator';
import { UserPayload } from '@/infra/auth/strategies/jwt.strategy';

import { NestEditSeoOverrideUseCase } from '@/infra/http/nest-use-cases/seo-overrides/nest-edit-seo-override.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';

import {
  EditSeoOverrideRequest,
  editSeoOverrideSchema,
} from '@/infra/types/zod/seo-overrides';
import {
  noContent204ResponseSwagger,
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
} from '@/infra/types/swagger/common';
import { EditSeoOverrideSwagger } from '@/infra/types/swagger/seo-overrides';

const bodyValidationPipe = new ZodValidationPipe(editSeoOverrideSchema);

@ApiBearerAuth()
@ApiTags('Seo Overrides')
@Controller('/seo-overrides/:seoOverrideId')
export class EditSeoOverrideController {
  constructor(private editSeoOverride: NestEditSeoOverrideUseCase) {}

  @Patch()
  @ApiOperation({ summary: 'Edit a seo override by id' })
  @ApiBody({ type: EditSeoOverrideSwagger })
  @ApiResponse(noContent204ResponseSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('seoOverrideId') seoOverrideId: string,
    @Body(bodyValidationPipe) body: EditSeoOverrideRequest,
  ) {
    const loggedUserId = userLogged.sub;
    const loggedUserRole = userLogged.user.role;

    const editSeoOverride = {
      loggedUserId,
      loggedUserRole,
      seoOverrideId,
      data: body,
    };

    const result = await this.editSeoOverride.execute(editSeoOverride);

    if (result.isLeft()) {
      const error = {
        error: result.value.constructor,
        message: result.value.message,
      };

      switch (result.value.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(errorNotAllowed);
        default:
          throw new BadRequestException(error);
      }
    }
  }
}
