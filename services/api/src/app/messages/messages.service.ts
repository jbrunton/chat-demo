import { HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  Dispatcher,
  isPrivate,
  Message,
} from '../../domain/entities/message.entity';
import * as R from 'rambda';
import { isCommand, parseMessage } from './parse-message';
import { MessagesRepository } from '@entities/messages.repository';
import { User } from '@entities/user.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { AuthService, Role } from '@entities/auth';
import { ProcessCommandUseCase } from '@usecases/process-command/process';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepo: MessagesRepository,
    private readonly roomsRepo: RoomsRepository,
    private readonly authService: AuthService,
    private readonly dispatcher: Dispatcher,
    private readonly processCommand: ProcessCommandUseCase,
  ) {}

  async handleMessage(incoming: CreateMessageDto, author: User): Promise<void> {
    try {
      const message = parseMessage(incoming, author);

      if (isCommand(message)) {
        await this.processCommand.exec(message, author);
        return;
      }

      const room = await this.roomsRepo.getRoom(message.roomId);
      await this.authService.authorize({
        user: author,
        subject: room,
        action: Role.Write,
        message: 'You do not have permission to post to this room',
      });

      const savedMessage = await this.messagesRepo.saveMessage({
        authorId: author.id,
        ...incoming,
      });
      this.dispatcher.emit(savedMessage);
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

  async findForRoom(roomId: string, user: User): Promise<Message[]> {
    const room = await this.roomsRepo.getRoom(roomId);
    await this.authService.authorize({
      user,
      subject: room,
      action: Role.Read,
    });

    const allMessages = await this.messagesRepo.getMessagesForRoom(roomId);
    const publicMessages = R.pipe(R.reject(isPrivate))(allMessages);

    return publicMessages;
  }
}
