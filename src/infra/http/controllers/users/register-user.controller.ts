import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

import { NestRegisterUserUseCase } from '@/infra/http/nest-use-cases/users/nest-register-user.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import { registerUserSchema } from '@/infra/types/zod/users';
import { Public } from '@/infra/auth/public';

import { RegisterUserUseCaseRequest } from '@/domain/website/application/use-cases/users/register-user.usecase';
import {
  EmailUserAlreadyExistsError,
  UsernameUserAlreadyExistsError,
} from '@/domain/website/application/use-cases/users/errors';
import {
  noContent201ResponseSwagger,
  unauthorizedErrorSwagger,
} from '@/infra/types/swagger/common';
import { CreateUserSwagger } from '@/infra/types/swagger/users';

const bodyValidationPipe = new ZodValidationPipe(registerUserSchema);

@ApiTags('Users')
@Controller('/users')
@Public()
export class RegisterUserController {
  constructor(private registerUser: NestRegisterUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: CreateUserSwagger })
  @ApiResponse(noContent201ResponseSwagger)
  @ApiResponse(unauthorizedErrorSwagger)
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterUserUseCaseRequest) {
    const result = await this.registerUser.execute(body);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EmailUserAlreadyExistsError:
        case UsernameUserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
