import * as R from 'rambda';
import { User } from '@features/messages/entities/user.entity';
import { UsersRepository } from '@features/messages/repositories/users.repository';

export class TestUsersRepository {
  private users: User[] = [];

  getData() {
    return this.users;
  }

  setData(users: User[]) {
    this.users = users;
  }

  async storeUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async getUsers(userIds: string[]): Promise<User[]> {
    return R.filter((user) => userIds.includes(user.id), this.users);
  }

  static readonly Provider = {
    provide: UsersRepository,
    useClass: TestUsersRepository,
  };
}
