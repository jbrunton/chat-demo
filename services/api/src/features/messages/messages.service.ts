import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './repositories/messages.repository';
import { UsersRepository } from './repositories/users.repository';
import { UserInfo } from '@lib/auth/user-profile/user-info';
import * as R from 'rambda';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepo: MessagesRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async saveMessage(
    message: CreateMessageDto,
    authorInfo: UserInfo,
  ): Promise<Message> {
    const time = new Date().getTime();
    const author = await this.usersRepo.storeUser(authorInfo);
    return this.messagesRepo.storeMessage(message, author.id, time);
  }

  async findForRoom(
    roomId: string,
  ): Promise<{ messages: Message[]; authors: object }> {
    const messages = await this.messagesRepo.getMessages(roomId);

    const authorIds = R.pipe(
      R.pluck('authorId'),
      R.reject(R.isNil),
      R.uniq,
    )(messages);

    const authors = await this.usersRepo.getUsers(authorIds);

    return {
      messages,
      authors: R.fromPairs(R.map((author) => [author.id, author], authors)),
    };
  }
}
