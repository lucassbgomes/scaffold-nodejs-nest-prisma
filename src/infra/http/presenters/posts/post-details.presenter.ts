import { PostDetails } from '@/domain/website/enterprise/entities/post/value-objects/post-details';
import { UserPresenter } from '../users/user.presenter';
import { SeoOverridePresenter } from '../seo-overrides/seo-override.presenter';

export class PostDetailsPresenter {
  static toJson(post: PostDetails) {
    return {
      id: post.id.toString(),
      title: post.title,
      slug: post.slug.value,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      content: post.content,
      seoOverride:
        post.seoOverride && SeoOverridePresenter.toJson(post.seoOverride),
      author: UserPresenter.toJson(post.author),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
