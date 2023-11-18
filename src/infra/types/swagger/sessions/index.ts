import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateDataSwagger {
  @ApiProperty({
    example: 'test@example.com',
    examples: ['test', 'test@example.com'],
  })
  username!: string;

  @ApiProperty({ example: '123456' })
  password!: string;
}

export class Authenticate201ResponseSwagger {
  @ApiProperty()
  access_token!: string;
}
export const authenticate201ResponseSwagger = {
  status: 201,
  description: 'Returns a JWT token',
  type: Authenticate201ResponseSwagger,
};

export class InvalidCredentialsErrorSwagger {
  @ApiProperty({ example: 'Unauthorized' })
  error!: number;

  @ApiProperty({ example: 'Invalid credentials' })
  message!: string;

  @ApiProperty({ example: 401 })
  statusCode!: number;
}
export const invalidCredentialsErrorSwagger = {
  status: 401,
  description: 'Unauthorized',
  type: InvalidCredentialsErrorSwagger,
};
