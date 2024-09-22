import { HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/messages';
import { SendMessageUseCase } from '@usecases/messages/send';
import { CommandService } from '@app/messages/command.service';
import { systemUser } from '@entities/users/system-user';
import { User } from '@entities/users/user';
import { isCommand, tokenizeMessage } from '@usecases/commands/tokenize';
import { IncomingMessage } from '@entities/messages/message';

@Injectable()
export class MessagesService {
  constructor(
    private readonly send: SendMessageUseCase,
    private readonly command: CommandService,
  ) {}

  async handleMessage(
    incoming: CreateMessageDto,
    authenticatedUser: User,
  ): Promise<void> {
    const message: IncomingMessage = {
      ...incoming,
      authorId: authenticatedUser.id,
    };

    try {
      if (isCommand(message)) {
        await this.command.exec(message, authenticatedUser);
      } else {
        await this.send.exec(message, authenticatedUser);
      }
    } catch (e) {
      if (e instanceof HttpException) {
        return await this.send.exec(
          this.getErrorMessage(e, message),
          systemUser,
        );
      }

      throw e;
    }
  }

  private getErrorMessage(e: HttpException, message: IncomingMessage) {
    return {
      content: e.message,
      roomId: message.roomId,
      recipientId: message.authorId,
      authorId: 'system',
    };
  }
}
