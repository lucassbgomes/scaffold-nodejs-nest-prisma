import {
  Either,
  NotAllowedError,
  ResourceNotFoundError,
  left,
  right,
} from '@/core/errors';

import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';
import { SeoOverridesRepository } from '@/domain/website/application/repositories';

export type DeleteSeoOverrideUseCaseRequest = {
  loggedUserId: string;
  loggedUserRole: UserEntityRole;
  seoOverrideId: string;
};

export type DeleteSeoOverrideUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

export class DeleteSeoOverrideUseCase {
  constructor(private seoOverridesRepository: SeoOverridesRepository) {}

  async execute({
    loggedUserId,
    loggedUserRole,
    seoOverrideId,
  }: DeleteSeoOverrideUseCaseRequest): Promise<DeleteSeoOverrideUseCaseResponse> {
    const seoOverrideFound =
      await this.seoOverridesRepository.findById(seoOverrideId);

    if (!seoOverrideFound) {
      return left(new ResourceNotFoundError());
    }

    if (
      loggedUserId !== seoOverrideFound.authorId.toString() &&
      loggedUserRole !== 'ADMIN' &&
      loggedUserRole !== 'MANAGER'
    ) {
      return left(new NotAllowedError());
    }

    await this.seoOverridesRepository.delete(seoOverrideFound);

    return right(null);
  }
}
