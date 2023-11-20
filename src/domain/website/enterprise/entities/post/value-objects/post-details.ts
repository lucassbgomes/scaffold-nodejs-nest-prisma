import { ValueObject } from '@/core/entities/value-object';
import { PostDetailsProps } from '../post.types';

export class PostDetails extends ValueObject<PostDetailsProps> {
  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get excerpt() {
    return this.props.excerpt;
  }

  get coverImage() {
    return this.props.coverImage;
  }

  get content() {
    return this.props.content;
  }

  get seoOverride() {
    return this.props.seoOverride;
  }

  get author() {
    return this.props.author;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: PostDetailsProps) {
    return new PostDetails(props);
  }
}
