import { UserEntity } from '@/domain/website/enterprise/entities';

export class UserPresenter {
  static toJson(user: UserEntity) {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      role: user.role,
    };
  }
}
