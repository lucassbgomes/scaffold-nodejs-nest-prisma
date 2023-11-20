import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { SeoOverrideDataSwagger } from '../seo-overrides';
import { UserDataSwagger } from '../users';

export class PostDataSwagger {
  @ApiProperty({ example: '534fc3e3-8041-44b9-a779-dd7747f72703' })
  id!: string;

  @ApiProperty({ example: 'Title example post' })
  title!: string;

  @ApiProperty({ example: 'title-example-post' })
  slug!: string;

  @ApiProperty({
    example:
      'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
  })
  excerpt!: string;

  @ApiProperty({ example: 'https://picsum.photos/200' })
  coverImage!: string;

  @ApiProperty({
    example:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
  })
  content!: string;

  @ApiProperty({
    example: '1c951ff4-9f64-41e2-8175-c3c914839053',
    nullable: true,
    required: false,
  })
  seoOverrideId!: string;

  @ApiProperty({
    example: '1c951ff4-9f64-41e2-8175-c3c914839053',
  })
  @ApiProperty()
  authorId!: string;

  @ApiProperty({ example: '2023-11-18T02:40:44.126Z' })
  createdAt!: string;

  @ApiProperty({
    example: '2023-11-18T02:40:44.126Z',
    nullable: true,
    required: false,
  })
  updatedAt!: string;
}

export class CreatePostSwagger extends IntersectionType(
  OmitType(PostDataSwagger, ['id', 'authorId', 'createdAt', 'updatedAt']),
  PartialType(PickType(PostDataSwagger, ['slug'])),
) {}

export class EditPostSwagger extends PartialType(CreatePostSwagger) {}

export class PostDetailsSwagger extends OmitType(PostDataSwagger, [
  'authorId',
  'seoOverrideId',
]) {
  @ApiProperty({ nullable: true })
  seoOverride?: SeoOverrideDataSwagger;

  @ApiProperty()
  author!: UserDataSwagger;
}

export class GetPostByIdSwagger {
  @ApiProperty({ nullable: true })
  post!: PostDataSwagger;
}
export const getPostByIdSwagger = {
  status: 200,
  description: 'Return a post',
  type: GetPostByIdSwagger,
};

export class GetPostDetailsSwagger {
  @ApiProperty({ nullable: true })
  post!: PostDetailsSwagger;
}

export const getPostDetailsSwagger = {
  status: 200,
  description: 'Returns details of a post',
  type: GetPostDetailsSwagger,
};

export class FetchPostsSwagger {
  @ApiProperty({ type: [PostDataSwagger] })
  posts!: PostDataSwagger[];
}
export const fetchPostsSwagger = {
  status: 200,
  description: 'Returns a post array',
  type: FetchPostsSwagger,
};
