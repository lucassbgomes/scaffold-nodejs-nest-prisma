import { ApiProperty } from '@nestjs/swagger';

export class NoContentResponseSwagger {}
export const noContent201ResponseSwagger = {
  status: 201,
  description: 'No content',
  type: NoContentResponseSwagger,
};

export const noContent204ResponseSwagger = {
  status: 204,
  description: 'No content',
  type: NoContentResponseSwagger,
};

export class ResourceNotFoundErrorSwagger {
  @ApiProperty({ example: 'ResourceNotFoundError' })
  error!: string;

  @ApiProperty({ example: 'Resource not found' })
  message!: string;
}
export const resourceNotFoundErrorSwagger = {
  status: 404,
  description: 'Resource not found',
  type: ResourceNotFoundErrorSwagger,
};

export class UnauthorizedErrorSwagger {
  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: 'Unauthorized' })
  message!: string;
}
export const unauthorizedErrorSwagger = {
  status: 401,
  description: 'Unauthorized',
  type: UnauthorizedErrorSwagger,
};

export const sizeQueryParamSwagger = {
  name: 'size',
  required: false,
  description: 'Default value 20',
};

export const pageQueryParamSwagger = {
  name: 'page',
  required: false,
  description: 'Default value 1',
};
