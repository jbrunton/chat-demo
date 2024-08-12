import { HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { User, systemUser } from '@entities/user.entity';
import { SendMessageUseCase } from '@usecases/messages/send';
import { CommandService } from '@app/messages/command.service';
import { isCommand, parseMessage } from '@usecases/messages/parse-message';

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
    const message = parseMessage({
      ...incoming,
      authorId: authenticatedUser.id,
    });

    try {
      if (isCommand(message)) {
        await this.command.exec(message, authenticatedUser);
      } else {
        await this.send.exec(message, authenticatedUser);
      }
    } catch (e) {
      if (e instanceof HttpException) {
        await this.send.exec(
          {
            content: e.message,
            roomId: incoming.roomId,
            recipientId: authenticatedUser.id,
            authorId: 'system',
          },
          systemUser,
        );
      } else {
        throw e;
      }
    }
  }
}
