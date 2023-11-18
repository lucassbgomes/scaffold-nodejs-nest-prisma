import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';

import { NestCreatePostUseCase } from '@/infra/http/nest-use-cases/posts/nest-create-post.usecase';
import { NestFetchPostsUseCase } from '@/infra/http/nest-use-cases/posts/nest-fetch-posts.usecase';
import { NestGetPostByIdUseCase } from '@/infra/http/nest-use-cases/posts/nest-get-post-by-id.usecase';
import { NestEditPostUseCase } from '@/infra/http/nest-use-cases/posts/nest-edit-post.usecase';
import { NestDeletePostUseCase } from '@/infra/http/nest-use-cases/posts/nest-delete-post.usecase';

import { CreatePostController } from '@/infra/http/controllers/posts/create-post.controller';
import { FetchPostsController } from '@/infra/http/controllers/posts/fetch-posts.controller';
import { GetPostByIdController } from '@/infra/http/controllers/posts/get-post-by-id.controller';
import { EditPostController } from '@/infra/http/controllers/posts/edit-post.controller';
import { DeleteUserController } from '@/infra/http/controllers/posts/delete-post.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreatePostController,
    FetchPostsController,
    GetPostByIdController,
    EditPostController,
    DeleteUserController,
  ],
  providers: [
    NestCreatePostUseCase,
    NestFetchPostsUseCase,
    NestGetPostByIdUseCase,
    NestEditPostUseCase,
    NestDeletePostUseCase,
  ],
  exports: [
    NestCreatePostUseCase,
    NestFetchPostsUseCase,
    NestGetPostByIdUseCase,
    NestEditPostUseCase,
    NestDeletePostUseCase,
  ],
})
export class PostsModule {}
