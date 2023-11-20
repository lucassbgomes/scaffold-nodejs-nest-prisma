import { Either, ResourceNotFoundError, left, right } from '@/core/errors';

import { PostsRepository } from '@/domain/website/application/repositories';
import { PostDetails } from '@/domain/website/enterprise/entities/post/value-objects/post-details';

export type GetPostDetailsUseCaseRequest = {
  postId: string;
};

export type GetPostDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  { post: PostDetails }
>;

export class GetPostDetailsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
  }: GetPostDetailsUseCaseRequest): Promise<GetPostDetailsUseCaseResponse> {
    const post = await this.postsRepository.findDetailsById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    return right({
      post,
    });
  }
}
