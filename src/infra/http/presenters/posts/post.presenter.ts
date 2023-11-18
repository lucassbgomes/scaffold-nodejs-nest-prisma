import { PostEntity } from '@/domain/website/enterprise/entities';

export class PostPresenter {
  static toJson(post: PostEntity) {
    return {
      id: post.id.toString(),
      title: post.title,
      slug: post.slug.value,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      seoOverrideId: post.seoOverrideId,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
