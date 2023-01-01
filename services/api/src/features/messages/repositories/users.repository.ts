import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DBAdapter, DBItem } from '@data/db.adapter';
import { UserInfo } from '@lib/auth/user-profile/user-info';

type UserData = {
  name: string;
  picture?: string;
};

type UserItem = DBItem<UserData>;

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DBAdapter) {}

  async storeUser(info: UserInfo): Promise<User> {
    const Id = `User#${info.sub}`;
    const data = {
      name: info.name ?? 'Anon',
      picture: info.picture,
    };
    const item: UserItem = {
      Id,
      Sort: 'User',
      Data: data,
      Type: 'User',
    };
    await this.db.putItem(item);
    return {
      id: Id,
      ...data,
    };
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
