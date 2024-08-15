import { AuthService, Role } from '@usecases/auth.service';
import { Dispatcher, DraftMessage } from '@entities/messages';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/users';
import { Injectable } from '@nestjs/common';

export type RenameRoomParams = {
  roomId: string;
  authenticatedUser: User;
  newName: string;
};

@Injectable()
export class RenameRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly auth: AuthService,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec(params: RenameRoomParams): Promise<void> {
    const { roomId, newName, authenticatedUser } = params;

    const room = await this.rooms.getRoom(roomId);

    await this.auth.authorize({
      user: authenticatedUser,
      action: Role.Manage,
      subject: room,
      message: 'You cannot rename this room. Only the owner can do this.',
    });

    const updatedRoom = await this.rooms.updateRoom({
      id: roomId,
      name: newName,
    });

    const message: DraftMessage = {
      content: `Room renamed to ${updatedRoom.name}`,
      roomId: room.id,
      authorId: 'system',
      updatedEntities: ['room'],
    };

    await this.dispatcher.send(message);
  }
}
