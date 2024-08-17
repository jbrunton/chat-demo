import { Dispatcher, DraftMessage, UpdatedEntity } from '@entities/messages';
import { JoinPolicy } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/users';
import { Injectable } from '@nestjs/common';
import { AuthService, Role } from '@usecases/auth.service';

export type ChangeRoomJoinPolicyParams = {
  roomId: string;
  authenticatedUser: User;
  newJoinPolicy: JoinPolicy;
};

@Injectable()
export class ChangeRoomJoinPolicyUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly authService: AuthService,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec({
    roomId,
    authenticatedUser,
    newJoinPolicy,
  }: ChangeRoomJoinPolicyParams): Promise<void> {
    const room = await this.rooms.getRoom(roomId);

    await this.authService.authorize({
      user: authenticatedUser,
      subject: room,
      action: Role.Manage,
      message: `You cannot change this room's join policy. Only the owner can do this.`,
    });

    await this.rooms.updateRoom({
      id: roomId,
      joinPolicy: newJoinPolicy,
    });

    const message: DraftMessage = {
      content: `Room join policy updated to ${newJoinPolicy}`,
      roomId: room.id,
      authorId: 'system',
      updatedEntities: [UpdatedEntity.Room],
    };

    await this.dispatcher.send(message);
  }
}
