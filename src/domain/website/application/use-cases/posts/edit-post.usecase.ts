import {
  Either,
  NotAllowedError,
  ResourceNotFoundError,
  left,
  right,
} from '@/core/errors';

import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';
import { PostsRepository } from '@/domain/website/application/repositories';
import { PostEntity } from '@/domain/website/enterprise/entities';

export type EditPostDataRequest = {
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  content?: string;
  seoOverrideId?: string;
};

export type EditPostUseCaseRequest = {
  loggedUserId: string;
  loggedUserRole: UserEntityRole;
  postId: string;
  data: EditPostDataRequest;
};

export type EditPostUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { post: PostEntity }
>;

export class EditPostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    loggedUserId,
    loggedUserRole,
    postId,
    data,
  }: EditPostUseCaseRequest): Promise<EditPostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

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

    Object.keys(data).forEach((key) => {
      if (key !== 'authorId') {
        post[key] = data[key];
      }
    });

    await this.postsRepository.save(post);

    return right({
      post,
    });
  }
}
