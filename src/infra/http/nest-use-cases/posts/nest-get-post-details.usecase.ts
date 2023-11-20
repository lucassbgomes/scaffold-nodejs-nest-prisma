import { Injectable } from '@nestjs/common';

import { PostsRepository } from '@/domain/website/application/repositories';
import { GetPostDetailsUseCase } from '@/domain/website/application/use-cases/posts/get-post-details.usecase';

@Injectable()
export class NestGetPostDetailsUseCase extends GetPostDetailsUseCase {
  constructor(postsRepository: PostsRepository) {
    super(postsRepository);
  }
}
