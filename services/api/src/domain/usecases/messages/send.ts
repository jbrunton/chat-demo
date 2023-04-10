import { AuthService, Role } from '@entities/auth';
import { Dispatcher, DraftMessage } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly messages: MessagesRepository,
    readonly dispatcher: Dispatcher,
    private readonly authService: AuthService,
  ) {}

  async exec(draft: DraftMessage, author: User): Promise<void> {
    const room = await this.rooms.getRoom(draft.roomId);
    await this.authService.authorize({
      user: author,
      subject: room,
      action: Role.Write,
      message: 'You do not have permission to post to this room.',
    });

    const message = await this.messages.saveMessage(draft);
    this.dispatcher.emit(message);
  }
}
