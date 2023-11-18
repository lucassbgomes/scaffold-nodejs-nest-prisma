import { Injectable } from '@nestjs/common';

import { PostsRepository } from '@/domain/website/application/repositories';
import { EditPostUseCase } from '@/domain/website/application/use-cases/posts/edit-post.usecase';

@Injectable()
export class NestEditPostUseCase extends EditPostUseCase {
  constructor(postsRepository: PostsRepository) {
    super(postsRepository);
  }
}
