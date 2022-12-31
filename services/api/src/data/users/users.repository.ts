import { Injectable } from '@nestjs/common';
import { omit, pick } from 'rambda';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/messages/entities/user.entity';
import { DbAdapter } from '../db.adapter';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DbAdapter) {}

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

  async getUsers(subs: string[]): Promise<Message[]> {
    const params = {};
    const data = await this.db.batchGet(
      subs.map((sub) => ({
        Id: `User#${sub}`,
        Sub: 'User',
      })),
    );
    console.log({ data });
    return [];
    // const data = await this.db.query({
    //   KeyConditionExpression: 'Id = :userId and Sort = :type',
    //   ExpressionAttributeValues: {
    //     ':userId': `User#${sub}`,
    //     ':type': 'User',
    //   },
    // });
    // const messages = data.Items?.map((item) => {
    //   const id = item.Sort;
    //   const data = item.Data;
    //   return {
    //     id,
    //     ...data,
    //   };
    // });
    // return messages || [];
  }
}
