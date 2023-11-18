import { PostEntity } from '@/domain/website/enterprise/entities';

export class PostPresenter {
  static toJson(post: PostEntity) {
    return {
      id: post.id.toString(),
      title: post.title,
      slug: post.slug.value,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      content: post.content,
      seoOverrideId: post.seoOverrideId?.toString(),
      authorId: post.authorId.toString(),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
