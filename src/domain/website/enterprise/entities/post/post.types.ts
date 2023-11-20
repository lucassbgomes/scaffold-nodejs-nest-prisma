import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Slug } from '@/domain/website/enterprise/entities/value-objects/slug';
import SeoOverrideEntity from '../seo-override/seo-override.entity';
import UserEntity from '../user/user.entity';

export type PostEntityData = {
  title: string;
  slug: Slug;
  excerpt: string;
  coverImage: string;
  content: string;
  seoOverrideId?: UniqueEntityID | null;
  authorId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date | null;
};

export type PostEntityProps = PostEntityData;

export type PostEntityResponseData = {
  id: UniqueEntityID;
  title: string;
  slug: Slug;
  excerpt: string;
  coverImage: string;
  content: string;
  seoOverrideId?: UniqueEntityID | null;
  authorId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date | null;
};

export interface PostDetailsProps {
  id: UniqueEntityID;
  title: string;
  slug: Slug;
  excerpt: string;
  coverImage: string;
  content: string;
  seoOverride?: SeoOverrideEntity | null;
  author: UserEntity;
  createdAt: Date;
  updatedAt?: Date | null;
}
