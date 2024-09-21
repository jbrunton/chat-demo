import {
  Dispatcher,
  DraftMessage,
  UpdatedEntity,
} from '@entities/messages/message';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/users/user.entity';
import { Injectable } from '@nestjs/common';
import { AuthService, Role } from '@usecases/auth.service';

export type ConfigureRoomParams = {
  roomId: string;
  authenticatedUser: User;
  newJoinPolicy?: JoinPolicy;
  newContentPolicy?: ContentPolicy;
};

@Injectable()
export class ConfigureRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly authService: AuthService,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec({
    roomId,
    authenticatedUser,
    newJoinPolicy,
    newContentPolicy,
  }: ConfigureRoomParams): Promise<void> {
    const room = await this.rooms.getRoom(roomId);

    await this.authService.authorize({
      user: authenticatedUser,
      subject: room,
      action: Role.Manage,
      message: `You cannot configure policies for this room. Only the owner can do this.`,
    });

    await this.rooms.updateRoom({
      id: roomId,
      joinPolicy: newJoinPolicy,
      contentPolicy: newContentPolicy,
    });

    if (newJoinPolicy) {
      const message: DraftMessage = {
        content: `Room join policy updated to ${newJoinPolicy}`,
        roomId: room.id,
        authorId: 'system',
        updatedEntities: [UpdatedEntity.Room],
      };

      await this.dispatcher.send(message);
    }

    if (newContentPolicy) {
      const message: DraftMessage = {
        content: `Room content policy updated to ${newContentPolicy}`,
        roomId: room.id,
        authorId: 'system',
        updatedEntities: [UpdatedEntity.Room],
      };

      await this.dispatcher.send(message);
    }
  }
}
