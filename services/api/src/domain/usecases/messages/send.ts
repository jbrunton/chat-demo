import { Dispatcher, DraftMessage } from '@entities/messages';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Role, AuthService } from '@usecases/auth.service';

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
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

    this.dispatcher.send(draft);
  }
}
