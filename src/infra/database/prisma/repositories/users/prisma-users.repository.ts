import { Injectable } from '@nestjs/common';

import { FetchParams } from '@/core/types/fetch-params';

import { UsersRepository } from '@/domain/website/application/repositories';
import { UserEntity } from '@/domain/website/enterprise/entities';

import { PrismaUserMapper } from '@/infra/database/prisma/mappers/users/prisma-user.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findMany({ page, size = 20 }: FetchParams): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      take: size,
      skip: (page - 1) * size,
    });

    return users.map(PrismaUserMapper.toDomain);
  }

  async create(user: UserEntity) {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({ data });
  }

  async save(user: UserEntity) {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }

  async delete({ id }: UserEntity) {
    await this.prisma.user.delete({
      where: {
        id: id.toString(),
      },
    });
  }
}
