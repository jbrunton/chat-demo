import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import * as crypto from 'crypto';
import { pick } from 'rambda';
import { Message } from './entities/message.entity';
import { DbAdapter } from 'src/data/db.adapter';
import { MessagesRepository } from '../data/messages/messages.repository';
import { User } from './entities/user.entity';
import { UsersRepository } from '../data/users/users.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepo: MessagesRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async create(
    { roomId, content }: CreateMessageDto,
    user: User,
  ): Promise<Message> {
    const time = new Date().getTime();
    const author = await this.usersRepo.storeUser(user);
    return await this.messagesRepo.storeMessage(
      {
        content,
        roomId,
        authorId: author.id,
      },
      time,
    );
  }

  async findForRoom(
    roomId: string,
  ): Promise<{ messages: Message[]; authors: User[] }> {
    const messages = await this.messagesRepo.getMessages(roomId);
    const authorIds = new Set(messages.map((msg) => msg.authorId));
    const authors = await this.usersRepo.getUsers(Array.from(authorIds));
    return {
      messages,
      authors,
    };
  }
}
