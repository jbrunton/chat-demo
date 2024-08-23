import { AuthService, Role } from '@usecases/auth.service';
import { MembershipStatus, isMemberOf } from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/users';
import { Injectable } from '@nestjs/common';
import {
  Dispatcher,
  DraftMessage,
  UpdatedEntity,
} from '@entities/messages/message';

export type LeaveRoomParams = {
  roomId: string;
  authenticatedUser: User;
};

@Injectable()
export class LeaveRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly memberships: MembershipsRepository,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec({ roomId, authenticatedUser }: LeaveRoomParams): Promise<void> {
    const room = await this.rooms.getRoom(roomId);

    await this.memberships.createMembership({
      userId: authenticatedUser.id,
      roomId,
      status: MembershipStatus.Revoked,
    });

    const message: DraftMessage = {
      content: `${authenticatedUser.name} left the room.`,
      roomId: room.id,
      authorId: 'system',
      updatedEntities: [UpdatedEntity.Room, UpdatedEntity.Users],
    };

    await this.dispatcher.send(message);
  }
}
