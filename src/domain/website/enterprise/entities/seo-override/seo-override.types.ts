import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type SeoOverrideEntityData = {
  title: string;
  description: string;
  image: string;
  authorId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date | null;
};

export type SeoOverrideEntityProps = SeoOverrideEntityData;

export type SeoOverrideEntityResponseData = {
  id: UniqueEntityID;
  title: string;
  description: string;
  image: string;
  authorId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date | null;
};
