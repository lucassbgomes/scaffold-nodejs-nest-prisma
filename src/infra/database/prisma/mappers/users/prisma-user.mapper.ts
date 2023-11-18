import { User, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserEntity } from '@/domain/website/enterprise/entities';

export class PrismaUserMapper {
  static toDomain(raw: User): UserEntity {
    return UserEntity.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        password: raw.password,
        username: raw.username,
        email: raw.email,
        role: raw.role,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: UserEntity): Prisma.UserUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      firstName: raw.firstName,
      lastName: raw.lastName,
      password: raw.password,
      username: raw.username,
      email: raw.email,
      role: raw.role,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }
}
