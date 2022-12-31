import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import * as crypto from 'crypto';
import { pick } from 'rambda';
import { Message } from './entities/message.entity';
import { DbAdapter } from 'src/data/db.adapter';
import { MessagesRepository } from 'src/data/messages/messages.repository';
import { User } from './entities/user.entity';
import { UsersRepository } from 'src/data/users/users.repository';

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

  async findForRoom(roomId: string): Promise<Message[]> {
    return this.messagesRepo.getMessages(roomId);
  }
}
