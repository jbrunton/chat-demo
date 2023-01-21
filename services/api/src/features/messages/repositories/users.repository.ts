import { Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { DBAdapter } from '@data/db.adapter';
import { AuthInfo } from '@lib/auth/identity/auth-info';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DBAdapter) {}

  async storeUser(params: AuthInfo): Promise<User> {
    return this.db.saveUser({
      name: params.name ?? 'Anon',
      ...params,
    });
  }

  async getUsers(userIds: string[]): Promise<User[]> {
    const found = await Promise.all(userIds.map((id) => this.db.getUser(id)));
    return found;
  }
}
