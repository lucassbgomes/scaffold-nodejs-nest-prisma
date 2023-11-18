import { Injectable } from '@nestjs/common';

import { PostsRepository } from '@/domain/website/application/repositories';
import { DeletePostUseCase } from '@/domain/website/application/use-cases/posts/delete-post.usecase';

@Injectable()
export class NestDeletePostUseCase extends DeletePostUseCase {
  constructor(postsRepository: PostsRepository) {
    super(postsRepository);
  }
}
