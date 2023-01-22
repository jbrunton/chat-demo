import { User } from '@entities/user.entity';
import { SaveUserParams, UsersRepository } from '@entities/users.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { pick } from 'rambda';
import { DynamoDBAdapter } from '../adapters/dynamodb.adapter';
import { DbUser } from '../adapters/schema';

@Injectable()
export class DynamoDBUsersRepository extends UsersRepository {
  constructor(private readonly adapter: DynamoDBAdapter) {
    super();
  }

  override async saveUser(params: SaveUserParams): Promise<User> {
    const user = await this.adapter.User.create(params, {
      exists: null,
      hidden: true,
    });
    return userFromRecord(user);
  }

  override async getUser(id: string): Promise<User> {
    const user = await this.adapter.User.get(
      { Id: id, Sort: 'user' },
      { hidden: true },
    );
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return userFromRecord(user);
  }
}

const userFromRecord = (record: DbUser): User => ({
  id: record.Id,
  ...pick(['name', 'picture'], record),
});
