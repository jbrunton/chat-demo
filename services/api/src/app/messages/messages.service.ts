import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  Draft,
  isPrivate,
  Message,
} from '../../domain/entities/message.entity';
import * as R from 'rambda';
import { DispatcherService } from './dispatcher.service';
import { isCommand, ParsedMessage, parseMessage } from './parse-message';
import { processCommand } from '@usecases/process-command/process';
import { MessagesRepository } from '@entities/messages.repository';
import { UsersRepository } from '@entities/users.repository';
import { User } from '@entities/user.entity';
import { RoomsRepository } from '@entities/rooms.repository';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly messagesRepo: MessagesRepository,
    private readonly usersRepo: UsersRepository,
    private readonly roomsRepo: RoomsRepository,
    private readonly dispatcher: DispatcherService,
  ) {}

  async handleMessage(
    incoming: CreateMessageDto,
    author: User,
  ): Promise<Message> {
    const processCommands = async (
      message: ParsedMessage,
    ): Promise<Draft<Message>> => {
      if (isCommand(message)) {
        return await processCommand(message, author, this.roomsRepo);
      }

      return message;
    };

    const message = await R.pipe(parseMessage, processCommands)(
      incoming,
      author,
    );

    const time = new Date().getTime();
    const storedMessage = await this.messagesRepo.saveMessage({
      ...message,
      time,
    });

    this.logger.log(`emitting event: ${JSON.stringify(storedMessage)}`);
    this.dispatcher.emit(storedMessage, author);
    return storedMessage;
  }

  async findForRoom(
    roomId: string,
  ): Promise<{ messages: Message[]; authors: object }> {
    const allMessages = await this.messagesRepo.getMessagesForRoom(roomId);

    const publicMessages = R.pipe(R.reject(isPrivate))(allMessages);

    const authorIds = R.pipe(
      R.pluck('authorId'),
      R.reject(R.isNil),
      R.reject((id) => id === 'system'),
      R.uniq,
    )(publicMessages);

    const authors = await Promise.all(
      authorIds.map((authorId) => this.usersRepo.getUser(authorId)),
    );

    return {
      messages: publicMessages,
      authors: R.fromPairs(R.map((author) => [author.id, author], authors)),
    };
  }
}
