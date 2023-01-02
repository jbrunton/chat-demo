import * as R from 'rambda';
import { CreateMessageDto } from '@features/messages/dto/create-message.dto';
import { Message } from '@features/messages/entities/message.entity';
import { UserInfo } from '@lib/auth/user-profile/user-info';
import { User } from '@features/messages/entities/user.entity';

export class TestUsersRepository {
  private users: User[] = [];

  getData() {
    return this.users;
  }

  setData(users: User[]) {
    this.users = users;
  }

  async storeUser(info: UserInfo): Promise<User> {
    const id = `User#${info.sub}`;
    const user: User = {
      id,
      name: info.name ?? 'Anon',
      picture: info.picture,
    };
    this.users.push(user);
    return user;
  }

  async getUsers(userIds: string[]): Promise<User[]> {
    return R.filter((user) => userIds.includes(user.id), this.users);
  }
}
