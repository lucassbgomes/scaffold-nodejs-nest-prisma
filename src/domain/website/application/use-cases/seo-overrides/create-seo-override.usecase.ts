import { Either, right } from '@/core/errors';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';

export type CreateSeoOverrideUseCaseRequest = {
  title: string;
  description: string;
  image: string;
  authorId: string;
};

export type CreateSeoOverrideUseCaseResponse = Either<
  null,
  { seoOverride: SeoOverrideEntity }
>;

export class CreateSeoOverrideUseCase {
  constructor(private seoOverridesRepository: SeoOverridesRepository) {}

  async execute({
    title,
    description,
    image,
    authorId,
  }: CreateSeoOverrideUseCaseRequest): Promise<CreateSeoOverrideUseCaseResponse> {
    const seoOverride = SeoOverrideEntity.create({
      title,
      description,
      image,
      authorId: new UniqueEntityID(authorId),
    });

    await this.seoOverridesRepository.create(seoOverride);

    return right({
      seoOverride,
    });
  }
}
