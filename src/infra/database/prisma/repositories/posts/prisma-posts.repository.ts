import { Injectable } from '@nestjs/common';

import { FetchParams } from '@/core/types/fetch-params';

import { PostsRepository } from '@/domain/website/application/repositories';
import { PostEntity } from '@/domain/website/enterprise/entities';

import { PrismaPostMapper } from '@/infra/database/prisma/mappers/posts/prisma-post.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaPostDetailsMapper } from '../../mappers/posts/prisma-post-details.mapper';
import { PostDetails } from '@/domain/website/enterprise/entities/post/value-objects/post-details';

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<PostEntity | null> {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      return null;
    }

    return PrismaPostMapper.toDomain(post);
  }

  async findDetailsById(id: string): Promise<PostDetails | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        seoOverride: true,
        author: true,
      },
    });

    if (!post) {
      return null;
    }

    return PrismaPostDetailsMapper.toDomain(post);
  }

  async findMany({ page, size = 20 }: FetchParams): Promise<PostEntity[]> {
    const posts = await this.prisma.post.findMany({
      take: size,
      skip: (page - 1) * size,
    });

    return posts.map(PrismaPostMapper.toDomain);
  }

  async findManyByAuthorId(
    authorId: string,
    { page, size = 20 }: FetchParams,
  ): Promise<PostEntity[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: authorId,
      },
      take: size,
      skip: (page - 1) * size,
    });

    return posts.map(PrismaPostMapper.toDomain);
  }

  async create(post: PostEntity) {
    const data = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.create({ data });
  }

  async save(post: PostEntity) {
    const data = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.update({
      where: {
        id: post.id.toString(),
      },
      data,
    });
  }

  async delete({ id }: PostEntity) {
    await this.prisma.post.delete({
      where: {
        id: id.toString(),
      },
    });
  }
}
