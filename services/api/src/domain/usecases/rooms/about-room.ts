import { Dispatcher, DraftMessage } from '@entities/messages/message';
import { RoomsRepository } from '@entities/rooms/rooms-repository';
import { User } from '@entities/users/user';
import { UsersRepository } from '@entities/users/users-repository';
import { Injectable } from '@nestjs/common';
import { AuthService, Role } from '@usecases/auth.service';

export type AboutRoomParams = {
  authenticatedUser: User;
  roomId: string;
};

@Injectable()
export class AboutRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly users: UsersRepository,
    private readonly auth: AuthService,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec({ roomId, authenticatedUser }: AboutRoomParams): Promise<void> {
    const room = await this.rooms.getRoom(roomId);

    await this.auth.authorize({
      user: authenticatedUser,
      subject: room,
      action: Role.Read,
    });

    const owner = await this.users.getUser(room.ownerId);

    const description = [
      `About ${room.name}:`,
      `Owner: ${owner.name}`,
      `Content policy: ${room.contentPolicy}`,
      `Join policy: ${room.joinPolicy}`,
    ].join('\n* ');

    const message: DraftMessage = {
      content: description,
      roomId: room.id,
      authorId: 'system',
      recipientId: authenticatedUser.id,
    };

    await this.dispatcher.send(message);
  }
}
