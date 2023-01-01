import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
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
  ): Promise<{ messages: Message[]; authors: object }> {
    const messages = await this.messagesRepo.getMessages(roomId);
    const authorIds = new Set(messages.map((msg) => msg.authorId));
    const authors = await this.usersRepo.getUsers(Array.from(authorIds));
    const authorsMap = Object.fromEntries(
      Array.from(authors.map((author) => [author.id, author])),
    );
    return {
      messages,
      authors: authorsMap,
    };
  }
}
