import { AuthService, Role } from '@entities/auth';
import { Dispatcher } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
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
    private readonly messages: MessagesRepository,
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

    const message = await this.messages.saveMessage({
      content: `Room renamed to ${updatedRoom.name}`,
      roomId: room.id,
      authorId: 'system',
      updatedEntities: ['room'],
    });

    this.dispatcher.emit(message);
  }
}
