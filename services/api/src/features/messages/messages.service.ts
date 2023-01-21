import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  Draft,
  isPrivate,
  Message,
} from '../../domain/entities/message.entity';
import { MessagesRepository } from './repositories/messages.repository';
import { UsersRepository } from './repositories/users.repository';
import * as R from 'rambda';
import { User } from '@entities/user.entity';
import { DispatcherService } from './dispatcher.service';
import { isCommand, ParsedMessage, parseMessage } from './parse-message';
import { processCommand } from '@usecases/process-command/process';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly messagesRepo: MessagesRepository,
    private readonly usersRepo: UsersRepository,
    private readonly dispatcher: DispatcherService,
  ) {}

  async handleMessage(
    incoming: CreateMessageDto,
    author: User,
  ): Promise<Message> {
    const processCommands = (message: ParsedMessage): Draft<Message> => {
      if (isCommand(message)) {
        return processCommand(message, author);
      }

      return message;
    };

    const message = R.pipe(parseMessage, processCommands)(incoming, author);

    const time = new Date().getTime();
    await this.usersRepo.storeUser(author);
    const storedMessage = await this.messagesRepo.storeMessage(message, time);

    this.logger.log(`emitting event: ${JSON.stringify(storedMessage)}`);
    this.dispatcher.emit(storedMessage, author);
    return storedMessage;
  }

  async findForRoom(
    roomId: string,
  ): Promise<{ messages: Message[]; authors: object }> {
    const allMessages = await this.messagesRepo.getMessages(roomId);

    const publicMessages = R.pipe(R.reject(isPrivate))(allMessages);

    const authorIds = R.pipe(
      R.pluck('authorId'),
      R.reject(R.isNil),
      R.uniq,
    )(publicMessages);

    const authors = await this.usersRepo.getUsers(authorIds);

    return {
      messages: publicMessages,
      authors: R.fromPairs(R.map((author) => [author.id, author], authors)),
    };
  }
}
