import { HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Dispatcher } from '../../domain/entities/message.entity';
import { isCommand, parseMessage } from './parse-message';
import { MessagesRepository } from '@entities/messages.repository';
import { User } from '@entities/user.entity';
import { ParseCommandUseCase } from '@usecases/commands/parse';
import { SendMessageUseCase } from '@usecases/messages/send';
import { CommandService } from '@app/commands/commands.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepo: MessagesRepository,
    private readonly dispatcher: Dispatcher,
    private readonly parseCommand: ParseCommandUseCase,
    private readonly send: SendMessageUseCase,
    private readonly command: CommandService,
  ) {}

  async handleMessage(incoming: CreateMessageDto, author: User): Promise<void> {
    try {
      const message = parseMessage(incoming, author);
      if (isCommand(message)) {
        const result = await this.parseCommand.exec(message);
        if (result) {
          await this.command.exec(result, incoming.roomId, author);
        }
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
