import { find } from 'rambda';
import { User } from '@entities/user.entity';
import { AuthInfo } from '@entities/auth-info';
import { UsersRepository } from '@entities/users.repository';
import { NotFoundException } from '@nestjs/common';

export class TestUsersRepository extends UsersRepository {
  private users: User[] = [];

  getData() {
    return this.users;
  }

  setData(users: User[]) {
    this.users = users;
  }

  override async saveUser(params: AuthInfo): Promise<User> {
    const user = {
      id: `user:${params.sub}`,
      name: params.name ?? 'Anon',
      picture: params.picture,
    };
    this.users.push(user);
    return user;
  }

  override async getUser(userId: string): Promise<User> {
    const user = find((user) => userId === user.id, this.users);
    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist`);
    }
    return user;
  }

  static readonly Provider = {
    provide: UsersRepository,
    useClass: TestUsersRepository,
  };
}
