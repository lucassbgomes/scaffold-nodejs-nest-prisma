import { Controller, Get, Query } from '@nestjs/common';
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
import { NestFetchUsersUseCase } from '@/infra/http/nest-use-cases/users/nest-fetch-users.usecase';
import { UserPresenter } from '@/infra/http/presenters/users/user.presenter';
import {
  unauthorizedErrorSwagger,
  resourceNotFoundErrorSwagger,
  pageQueryParamSwagger,
  sizeQueryParamSwagger,
} from '@/infra/types/swagger/common';
import { fetchUsersSwagger } from '@/infra/types/swagger/users';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('/users')
export class FetchUsersController {
  constructor(private fetchUsers: NestFetchUsersUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Fetch users' })
  @ApiResponse(fetchUsersSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @ApiResponse(resourceNotFoundErrorSwagger)
  @ApiQuery(sizeQueryParamSwagger)
  @ApiQuery(pageQueryParamSwagger)
  async handle(
    @Query('size', sizeQueryValidationPipe) size: SizeQueryParamSchema,
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { value } = await this.fetchUsers.execute({
      page: page ?? 1,
      size,
    });

    const users = value?.users.map(UserPresenter.toJson) ?? [];

    return {
      users,
    };
  }
}
