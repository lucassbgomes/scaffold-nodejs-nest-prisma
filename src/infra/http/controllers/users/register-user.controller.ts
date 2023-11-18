import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { NestRegisterUserUseCase } from '@/infra/http/nest-use-cases/users/nest-register-user.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod/zod-validation.pipe';
import { registerUserSchema } from '@/infra/types/zod/users';
import { RegisterUserUseCaseRequest } from '@/domain/website/application/use-cases/users/register-user.usecase';
import {
  EmailUserAlreadyExistsError,
  UsernameUserAlreadyExistsError,
} from '@/domain/website/application/use-cases/users/errors';

@Controller('/users')
@Public()
export class RegisterUserController {
  constructor(private registerUser: NestRegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async handle(@Body() body: RegisterUserUseCaseRequest) {
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
