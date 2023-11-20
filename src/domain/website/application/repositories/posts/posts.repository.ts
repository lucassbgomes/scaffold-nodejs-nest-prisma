import { FetchParams } from '@/core/types/fetch-params';

import { PostEntity } from '@/domain/website/enterprise/entities';
import { PostDetails } from '@/domain/website/enterprise/entities/post/value-objects/post-details';

export default abstract class PostsRepository {
  abstract findById(id: string): Promise<PostEntity | null>;

  abstract findDetailsById(id: string): Promise<PostDetails | null>;

  abstract findMany(params: FetchParams): Promise<PostEntity[]>;

  abstract findManyByAuthorId(
    authorId: string,
    params: FetchParams,
  ): Promise<PostEntity[]>;

  abstract create(data: PostEntity): Promise<void>;

  abstract save(data: PostEntity): Promise<void>;

  abstract delete(data: PostEntity): Promise<void>;
}
