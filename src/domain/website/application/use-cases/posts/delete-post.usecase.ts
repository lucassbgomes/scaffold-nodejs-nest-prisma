import {
  Either,
  NotAllowedError,
  ResourceNotFoundError,
  left,
  right,
} from '@/core/errors';

import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';
import { PostsRepository } from '@/domain/website/application/repositories';

export type DeletePostUseCaseRequest = {
  loggedUserId: string;
  loggedUserRole: UserEntityRole;
  postId: string;
};

export type DelePostUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

export class DeletePostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    loggedUserId,
    loggedUserRole,
    postId,
  }: DeletePostUseCaseRequest): Promise<DelePostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId.toString());

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    if (
      loggedUserId !== post.authorId.toString() &&
      loggedUserRole !== 'ADMIN' &&
      loggedUserRole !== 'MANAGER'
    ) {
      return left(new NotAllowedError());
    }

    await this.postsRepository.delete(post);

    return right(null);
  }
}
