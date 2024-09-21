import { Injectable, NotFoundException } from '@nestjs/common';
import { pick } from 'rambda';
import { DynamoDBAdapter } from '../../adapters/dynamodb/dynamodb.adapter';
import { DbUser } from '../../adapters/dynamodb/schema';
import {
  UsersRepository,
  SaveUserParams,
  UpdateUserParams,
} from '@entities/users/users-repository';
import { User } from '@entities/users/user';

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

  override async findUser(email: string): Promise<User | null> {
    const [user] = await this.adapter.User.scan(
      {},
      {
        where: '${email} = @{email}',
        substitutions: {
          email,
        },
        hidden: true,
      },
    );
    return user ? userFromRecord(user) : null;
  }

  override async updateUser(params: UpdateUserParams): Promise<User> {
    const { id, ...rest } = params;
    const user = await this.adapter.User.get(
      { Id: id, Sort: 'user' },
      { hidden: true },
    );
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    const result = await this.adapter.User.update(
      {
        Id: id,
        Sort: 'user',
        ...rest,
      },
      { hidden: true },
    );
    return userFromRecord(result);
  }
}

const userFromRecord = (record: DbUser): User => ({
  id: record.Id,
  ...pick(['name', 'picture', 'email'], record),
});
