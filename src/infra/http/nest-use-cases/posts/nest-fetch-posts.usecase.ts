import { Injectable } from '@nestjs/common';

import { PostsRepository } from '@/domain/website/application/repositories';
import { FetchPostsUseCase } from '@/domain/website/application/use-cases/posts/fetch-posts.usecase';

@Injectable()
export class NestFetchPostsUseCase extends FetchPostsUseCase {
  constructor(postsRepository: PostsRepository) {
    super(postsRepository);
  }
}
