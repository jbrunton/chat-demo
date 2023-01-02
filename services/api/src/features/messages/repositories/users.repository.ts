import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DBAdapter, DBItem } from '@data/db.adapter';
import { pick } from 'rambda';

type UserData = {
  name: string;
  picture?: string;
};

type UserItem = DBItem<UserData>;

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DBAdapter) {}

  async storeUser(user: User): Promise<User> {
    const data = pick(['name', 'picture'], user);
    const item: UserItem = {
      Id: user.id,
      Sort: 'User',
      Data: data,
      Type: 'User',
    };
    await this.db.putItem(item);
    return user;
  }

  async getUsers(userIds: string[]): Promise<User[]> {
    const params = userIds.map((userId) => ({
      Id: userId,
      Sort: 'User',
    }));
    const userItems = await this.db.batchGet<UserData>(params);
    return userItems.map((item) => ({
      id: item.Id,
      ...item.Data,
    }));
  }
}
