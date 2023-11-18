import { FetchParams } from '@/core/types/fetch-params';
import { UserEntity } from '@/domain/website/enterprise/entities';

export default abstract class UsersRepository {
  abstract findById(id: string): Promise<UserEntity | null>;

  abstract findByEmail(email: string): Promise<UserEntity | null>;

  abstract findByUsername(username: string): Promise<UserEntity | null>;

  abstract findMany(params: FetchParams): Promise<UserEntity[]>;

  abstract create(data: UserEntity): Promise<void>;

  abstract save(data: UserEntity): Promise<void>;

  abstract delete(data: UserEntity): Promise<void>;
}
