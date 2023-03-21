import { AuthService, Role } from '@entities/auth';
import { isPrivate, Message } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { pipe, reject } from 'rambda';

@Injectable()
export class GetMessagesUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly messages: MessagesRepository,
    private readonly authService: AuthService,
  ) {}

  async exec(roomId: string, user: User): Promise<Message[]> {
    const room = await this.rooms.getRoom(roomId);
    await this.authService.authorize({
      user,
      subject: room,
      action: Role.Read,
    });

    const allMessages = await this.messages.getMessagesForRoom(roomId);
    const publicMessages = pipe(reject(isPrivate))(allMessages);

    return publicMessages;
  }
}
