import {
  Either,
  NotAllowedError,
  ResourceNotFoundError,
  left,
  right,
} from '@/core/errors';
import { UsersRepository } from '@/domain/website/application/repositories';
import { UserEntityRole } from '@/domain/website/enterprise/entities/user/user.types';

export type DeleteUserUseCaseRequest = {
  loggedUserId: string;
  loggedUserRole: UserEntityRole;
  userId: string;
};

export type DeleteUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    loggedUserId,
    loggedUserRole,
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (loggedUserId !== userId && loggedUserRole !== 'ADMIN') {
      return left(new NotAllowedError());
    }

    await this.usersRepository.delete(user);

    return right(null);
  }
}
