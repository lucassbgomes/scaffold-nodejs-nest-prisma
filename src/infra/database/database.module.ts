import { Module } from '@nestjs/common';

import {
  PostsRepository,
  SeoOverridesRepository,
  UsersRepository,
} from '@/domain/website/application/repositories/index';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/users/prisma-users.repository';
import { PrismaPostsRepository } from '@/infra/database/prisma/repositories/posts/prisma-posts.repository';
import { PrismaSeoOverridesRepository } from '@/infra/database/prisma/repositories/seo-overrides/prisma-seo-overrides.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: PostsRepository,
      useClass: PrismaPostsRepository,
    },
    {
      provide: SeoOverridesRepository,
      useClass: PrismaSeoOverridesRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    PostsRepository,
    SeoOverridesRepository,
  ],
})
export class DatabaseModule {}
