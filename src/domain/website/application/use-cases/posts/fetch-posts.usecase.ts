import { Either, right } from '@/core/errors';
import { FetchParams } from '@/core/types/fetch-params';

import { PostsRepository } from '@/domain/website/application/repositories';
import { PostEntity } from '@/domain/website/enterprise/entities';

export type FetchPostsUseCaseRequest = FetchParams;

export type FetchPostsUseCaseResponse = Either<null, { posts: PostEntity[] }>;

export class FetchPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    page,
    size,
  }: FetchPostsUseCaseRequest): Promise<FetchPostsUseCaseResponse> {
    const posts = await this.postsRepository.findMany({ page, size });

    return right({
      posts,
    });
  }
}
