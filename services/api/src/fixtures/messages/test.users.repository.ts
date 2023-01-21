import { filter } from 'rambda';
import { User } from '@entities/user.entity';
import { UsersRepository } from '@features/messages/repositories/users.repository';
import { AuthInfo } from '@lib/auth/identity/auth-info';

export class TestUsersRepository {
  private users: User[] = [];

  getData() {
    return this.users;
  }

  setData(users: User[]) {
    this.users = users;
  }

  async storeUser(params: AuthInfo): Promise<User> {
    const user = {
      id: `user:${params.sub}`,
      name: params.name ?? 'Anon',
      picture: params.picture,
    };
    this.users.push(user);
    return user;
  }

  async getUsers(userIds: string[]): Promise<User[]> {
    return filter((user) => userIds.includes(user.id), this.users);
  }

  static readonly Provider = {
    provide: UsersRepository,
    useClass: TestUsersRepository,
  };
}
