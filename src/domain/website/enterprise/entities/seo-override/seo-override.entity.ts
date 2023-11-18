import { Entity } from '@/core/entities/entity';
import { SeoOverrideEntityProps } from './seo-override.types';
import { Optional } from '@/core/types/optional';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export default class SeoOverrideEntity extends Entity<SeoOverrideEntityProps> {
  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;

    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;

    this.touch();
  }

  get image() {
    return this.props.image;
  }

  set image(image: string) {
    this.props.image = image;

    this.touch();
  }

  get authorId() {
    return this.props.authorId;
  }

  set authorId(authorId: UniqueEntityID) {
    this.props.authorId = authorId;

    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<SeoOverrideEntityProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const seoOverride = new SeoOverrideEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return seoOverride;
  }
}
