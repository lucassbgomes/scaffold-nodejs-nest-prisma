import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { UserEntity } from '@/domain/website/enterprise/entities';
import { UserEntityProps } from '@/domain/website/enterprise/entities/user/user.types';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/users/prisma-user.mapper';

export default function makeUser(
  override: Partial<UserEntityProps> = {},
  id?: UniqueEntityID,
) {
  const user = UserEntity.create(
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(
    data: Partial<UserEntityProps> = {},
  ): Promise<UserEntity> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
