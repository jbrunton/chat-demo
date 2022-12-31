import { Injectable } from '@nestjs/common';
import { omit, pick } from 'rambda';
import { User } from 'src/messages/entities/user.entity';
import { DynamoDBAdapter } from '../adapters/dynamodb.adapter';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DynamoDBAdapter) {}

  async storeUser(user: User): Promise<User> {
    const Id = `User#${user.id}`;
    const params = {
      Item: {
        Id,
        Sort: 'User',
        Data: pick(['name', 'picture'], user),
        Type: 'User',
      },
    };
    await this.db.putItem(params);
    return {
      id: Id,
      ...omit(['id'], user),
    };
  }

  async getUsers(userIds: string[]): Promise<User[]> {
    const params = userIds.map((userId) => ({
      Id: userId,
      Sort: 'User',
    }));
    const userItems = await this.db.batchGet(params);
    return userItems.map((item) => ({
      id: item.Id,
      name: item.Data.name,
      picture: item.Data.picture,
    }));
  }
}
