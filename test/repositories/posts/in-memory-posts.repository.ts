import { FetchParams } from '@/core/types/fetch-params';
import { PostsRepository } from '@/domain/website/application/repositories';
import { PostEntity } from '@/domain/website/enterprise/entities';

export default class InMemoryPostsRepository implements PostsRepository {
  public items: PostEntity[] = [];

  async findById(id: string): Promise<PostEntity | null> {
    const post = this.items.find((item) => item.id.toString() === id);

    if (!post) {
      return null;
    }

    return post;
  }

  async findMany({ page, size = 20 }: FetchParams): Promise<PostEntity[]> {
    const posts = this.items.slice((page - 1) * size, page * size);

    return posts;
  }

  async findManyByAuthorId(
    authorId: string,
    { page, size = 20 }: FetchParams,
  ): Promise<PostEntity[]> {
    const posts = this.items
      .filter((item) => item.authorId.toString() === authorId)
      .slice((page - 1) * size, page * size);

    return posts;
  }

  async create(post: PostEntity) {
    this.items.push(post);
  }

  async save(post: PostEntity) {
    const itemIndex = this.items.findIndex((item) => item.id === post.id);

    this.items[itemIndex] = post;
  }

  async delete(post: PostEntity) {
    const itemIndex = this.items.findIndex((item) => item.id === post.id);

    this.items.splice(itemIndex, 1);
  }
}
