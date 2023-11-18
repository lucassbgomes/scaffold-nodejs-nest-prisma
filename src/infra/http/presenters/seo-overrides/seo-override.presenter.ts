import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';

export class SeoOverridePresenter {
  static toJson(seoOverride: SeoOverrideEntity) {
    return {
      id: seoOverride.id.toString(),
      title: seoOverride.title,
      description: seoOverride.description,
      image: seoOverride.image,
      authorId: seoOverride.authorId,
      createdAt: seoOverride.createdAt,
      updatedAt: seoOverride.updatedAt,
    };
  }
}
