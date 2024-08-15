import { Role, AuthService } from '@usecases/auth.service';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { pipe, reject } from 'rambda';
import { MessagesRepository, SentMessage, isPrivate } from '@entities/messages';

@Injectable()
export class GetMessagesUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly messages: MessagesRepository,
    private readonly authService: AuthService,
  ) {}

  async exec(roomId: string, user: User): Promise<SentMessage[]> {
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
