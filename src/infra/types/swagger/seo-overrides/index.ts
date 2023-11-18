import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class SeoOverrideDataSwagger {
  @ApiProperty({ example: '534fc3e3-8041-44b9-a779-dd7747f72703' })
  id!: string;

  @ApiProperty({ example: 'Title example seo override' })
  title!: string;

  @ApiProperty({
    example:
      'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
  })
  description!: string;

  @ApiProperty({ example: 'https://picsum.photos/200' })
  image!: string;

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

export class CreateSeoOverrideSwagger extends OmitType(SeoOverrideDataSwagger, [
  'id',
  'authorId',
  'createdAt',
  'updatedAt',
]) {}

export class EditSeoOverrideSwagger extends PartialType(
  CreateSeoOverrideSwagger,
) {}

export class GetSeoOverrideByIdSwagger {
  @ApiProperty({ nullable: true })
  seoOverride!: SeoOverrideDataSwagger;
}
export const getSeoOverrideByIdSwagger = {
  status: 200,
  description: 'Return a seo override',
  type: GetSeoOverrideByIdSwagger,
};

export class FetchSeoOverridesSwagger {
  @ApiProperty({ type: [SeoOverrideDataSwagger] })
  seoOverrides!: SeoOverrideDataSwagger[];
}
export const fetchSeoOverridesSwagger = {
  status: 200,
  description: 'Returns a seo override array',
  type: FetchSeoOverridesSwagger,
};
