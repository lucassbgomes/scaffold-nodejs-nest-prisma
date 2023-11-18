import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Slug } from '../value-objects/slug';

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
