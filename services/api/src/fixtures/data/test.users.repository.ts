import { find, reject } from 'rambda';
import { User } from '@entities/users';
import { AuthInfo } from '@entities/auth';
import { UpdateUserParams, UsersRepository } from '@entities/users';
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

  override async updateUser(params: UpdateUserParams): Promise<User> {
    const user = find((user) => params.id === user.id, this.users);
    if (!user) {
      throw new NotFoundException(`User ${params.id} does not exist`);
    }
    const updatedUser = {
      ...user,
      ...params,
    };
    this.users = [
      ...reject((user) => params.id === user.id, this.users),
      updatedUser,
    ];
    return updatedUser;
  }
}
