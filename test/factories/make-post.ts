import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { PostEntity } from '@/domain/website/enterprise/entities';
import { PostEntityProps } from '@/domain/website/enterprise/entities/post/post.types';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaPostMapper } from '@/infra/database/prisma/mappers/posts/prisma-post.mapper';
import { Slug } from '@/domain/website/enterprise/entities/value-objects/slug';

export default function makePost(
  override: Partial<PostEntityProps> = {},
  id?: UniqueEntityID,
) {
  const post = PostEntity.create(
    {
      title: faker.person.firstName(),
      slug: Slug.create(faker.lorem.slug()),
      excerpt: faker.person.lastName(),
      coverImage: faker.image.url(),
      content: faker.lorem.text(),
      authorId: new UniqueEntityID('new-post'),
      ...override,
    },
    id,
  );

  return post;
}

@Injectable()
export class PostFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPost(
    data: Partial<PostEntityProps> = {},
  ): Promise<PostEntity> {
    const post = makePost(data);

    await this.prisma.post.create({
      data: PrismaPostMapper.toPrisma(post),
    });

    return post;
  }
}
