import {
  Either,
  NotAllowedError,
  ResourceNotFoundError,
  left,
  right,
} from '@/core/errors';

import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';
import { SeoOverridesRepository } from '@/domain/website/application/repositories';
import { SeoOverrideEntity } from '@/domain/website/enterprise/entities';

export type EditSeoOverrideDataRequest = {
  title?: string;
  description?: string;
  image?: string;
};

export type EditSeoOverrideUseCaseRequest = {
  loggedUserId: string;
  loggedUserRole: UserEntityRole;
  seoOverrideId: string;
  data: EditSeoOverrideDataRequest;
};

export type EditSeoOverrideUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { seoOverride: SeoOverrideEntity }
>;

export class EditSeoOverrideUseCase {
  constructor(private seoOverridesRepository: SeoOverridesRepository) {}

  async execute({
    loggedUserId,
    loggedUserRole,
    seoOverrideId,
    data,
  }: EditSeoOverrideUseCaseRequest): Promise<EditSeoOverrideUseCaseResponse> {
    const seoOverride =
      await this.seoOverridesRepository.findById(seoOverrideId);

    if (!seoOverride) {
      return left(new ResourceNotFoundError());
    }

    if (
      loggedUserId !== seoOverride.authorId.toString() &&
      loggedUserRole !== 'ADMIN' &&
      loggedUserRole !== 'MANAGER'
    ) {
      return left(new NotAllowedError());
    }

    Object.keys(data).forEach((key) => {
      if (key !== 'authorId') {
        seoOverride[key] = data[key];
      }
    });

    await this.seoOverridesRepository.save(seoOverride);

    return right({
      seoOverride,
    });
  }
}
