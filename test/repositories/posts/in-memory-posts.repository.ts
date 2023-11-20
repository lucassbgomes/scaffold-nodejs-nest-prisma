import { FetchParams } from '@/core/types/fetch-params';
import { PostsRepository } from '@/domain/website/application/repositories';
import { PostEntity } from '@/domain/website/enterprise/entities';
import { PostDetails } from '@/domain/website/enterprise/entities/post/value-objects/post-details';
import InMemoryUsersRepository from '../users/in-memory-users.repository';
import InMemorySeoOverridesRepository from '../seo-overrides/in-memory-seo-overrides.repository';

export default class InMemoryPostsRepository implements PostsRepository {
  public items: PostEntity[] = [];

  constructor(
    private usersRepository: InMemoryUsersRepository,
    private seoOverrideRepository: InMemorySeoOverridesRepository,
  ) {}

  async findById(id: string): Promise<PostEntity | null> {
    const post = this.items.find((item) => item.id.toString() === id);

    if (!post) {
      return null;
    }

    return post;
  }

  async findDetailsById(id: string): Promise<PostDetails | null> {
    const post = this.items.find((item) => item.id.toString() === id);

    if (!post) {
      return null;
    }

    const seoOverride = this.seoOverrideRepository.items.find(
      (seo) => post.seoOverrideId && seo.id.equals(post.seoOverrideId),
    );

    const author = this.usersRepository.items.find((user) =>
      user.id.equals(post.authorId),
    );

    return PostDetails.create({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      content: post.content,
      seoOverride,
      author: author!,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
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
