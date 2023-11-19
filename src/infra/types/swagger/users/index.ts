import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';

export class UserDataSwagger {
  @ApiProperty({ example: '534fc3e3-8041-44b9-a779-dd7747f72703' })
  id!: string;

  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'john.doe' })
  username!: string;

  @ApiProperty({ example: '123456password' })
  password!: string;

  @ApiProperty({
    enum: ['ADMIN', 'MANAGER', 'SUPPORT', 'CLIENT'],
    example: 'CLIENT',
    nullable: true,
    required: false,
  })
  role!: UserEntityRole;

  @ApiProperty({ example: '2023-11-18T02:40:44.126Z' })
  createdAt!: string;

  @ApiProperty({
    example: '2023-11-18T02:40:44.126Z',
    nullable: true,
    required: false,
  })
  updatedAt!: string;

  @ApiProperty({
    example: '2023-11-18T02:40:44.126Z',
    nullable: true,
    required: false,
  })
  deletedAt!: string;
}

export class CreateUserSwagger extends OmitType(UserDataSwagger, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class EditUserSwagger extends PartialType(CreateUserSwagger) {}

export class GetUserSwagger {
  @ApiProperty({ nullable: true })
  user!: UserDataSwagger;
}
export const getUserSwagger = {
  status: 200,
  description: 'Return a user',
  type: GetUserSwagger,
};

export class FetchUsersSwagger {
  @ApiProperty({ type: [UserDataSwagger] })
  users!: UserDataSwagger[];
}
export const fetchUsersSwagger = {
  status: 200,
  description: 'Returns a user array',
  type: FetchUsersSwagger,
};
