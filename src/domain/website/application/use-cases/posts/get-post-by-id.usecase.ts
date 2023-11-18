import { Either, ResourceNotFoundError, left, right } from '@/core/errors';

import { PostsRepository } from '@/domain/website/application/repositories';
import { PostEntity } from '@/domain/website/enterprise/entities';

export type GetPostByIdUseCaseRequest = {
  postId: string;
};

export type GetPostByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { post: PostEntity }
>;

export class GetPostByIdUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
  }: GetPostByIdUseCaseRequest): Promise<GetPostByIdUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    return right({
      post,
    });
  }
}
