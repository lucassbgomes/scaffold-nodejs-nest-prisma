import { Slug } from './slug';

describe('Slug Value Object', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFromText('Example post title');

    expect(slug.value).toEqual('example-post-title');
  });
});
