import { Injectable } from '@nestjs/common';

import { PostsRepository } from '@/domain/website/application/repositories';
import { CreatePostUseCase } from '@/domain/website/application/use-cases/posts/create-post.usecase';

@Injectable()
export class NestCreatePostUseCase extends CreatePostUseCase {
  constructor(postsRepository: PostsRepository) {
    super(postsRepository);
  }
}
