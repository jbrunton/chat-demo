import { HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Dispatcher } from '../../domain/entities/message.entity';
import { isCommand, parseMessage } from './parse-message';
import { MessagesRepository } from '@entities/messages.repository';
import { User } from '@entities/user.entity';
import { ProcessCommandUseCase } from '@usecases/process-command/process';
import { SendMessageUseCase } from '@usecases/messages/send';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepo: MessagesRepository,
    private readonly dispatcher: Dispatcher,
    private readonly processCommand: ProcessCommandUseCase,
    private readonly send: SendMessageUseCase,
  ) {}

  async handleMessage(incoming: CreateMessageDto, author: User): Promise<void> {
    try {
      const message = parseMessage(incoming, author);
      if (isCommand(message)) {
        await this.processCommand.exec(message, author);
      } else {
        await this.send.exec(message, author);
      }
    } catch (e) {
      if (e instanceof HttpException) {
        const message = await this.messagesRepo.saveMessage({
          content: e.message,
          roomId: incoming.roomId,
          recipientId: author.id,
          authorId: 'system',
        });
        this.dispatcher.emit(message);
      } else {
        throw e;
      }
    }
  }
}
