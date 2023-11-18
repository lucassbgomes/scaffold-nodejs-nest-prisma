import { Injectable } from '@nestjs/common';

import { PostsRepository } from '@/domain/website/application/repositories';
import { GetPostByIdUseCase } from '@/domain/website/application/use-cases/posts/get-post-by-id.usecase';

@Injectable()
export class NestGetPostByIdUseCase extends GetPostByIdUseCase {
  constructor(postsRepository: PostsRepository) {
    super(postsRepository);
  }
}
