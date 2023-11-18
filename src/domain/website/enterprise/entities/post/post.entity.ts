import { Entity } from '@/core/entities/entity';
import { PostEntityProps } from './post.types';
import { Slug } from '../value-objects/slug';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export default class PostEntity extends Entity<PostEntityProps> {
  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get excerpt() {
    return this.props.excerpt;
  }

  set excerpt(excerpt: string) {
    this.props.excerpt = excerpt;

    this.touch();
  }

  get coverImage() {
    return this.props.coverImage;
  }

  set coverImage(coverImage: string) {
    this.props.coverImage = coverImage;

    this.touch();
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;

    this.touch();
  }

  get seoOverrideId() {
    return this.props.seoOverrideId;
  }

  set seoOverrideId(seoOverrideId: UniqueEntityID | null | undefined) {
    this.props.seoOverrideId = seoOverrideId;

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
    props: Optional<PostEntityProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const post = new PostEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return post;
  }
}
