import { FetchParams } from '@/core/types/fetch-params';
import { UsersRepository } from '@/domain/website/application/repositories';
import { UserEntity } from '@/domain/website/enterprise/entities';

export default class InMemoryUsersRepository implements UsersRepository {
  public items: UserEntity[] = [];

  async findById(id: string): Promise<UserEntity | null> {
    const user = this.items.find((item) => item.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = this.items.find((item) => item.username === username);

    if (!user) {
      return null;
    }

    return user;
  }

  async findMany({ page, size = 20 }: FetchParams): Promise<UserEntity[]> {
    const users = this.items.slice((page - 1) * size, page * size);

    return users;
  }

  async create(user: UserEntity) {
    this.items.push(user);
  }

  async save(user: UserEntity) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items[itemIndex] = user;
  }

  async delete(user: UserEntity) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items.splice(itemIndex, 1);
  }
}
