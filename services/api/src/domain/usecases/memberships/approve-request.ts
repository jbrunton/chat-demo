import {
  MembershipStatus,
  getMembershipStatus,
} from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { Dispatcher, DraftMessage } from '@entities/messages/message';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/users/user';
import { UsersRepository } from '@entities/users/users-repository';
import { Injectable } from '@nestjs/common';
import { AuthService, Role } from '@usecases/auth.service';

export type ApproveRequestParams = {
  authenticatedUser: User;
  roomId: string;
  email: string;
};

@Injectable()
export class ApproveRequestUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly users: UsersRepository,
    private readonly memberships: MembershipsRepository,
    private readonly auth: AuthService,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec({
    authenticatedUser,
    roomId,
    email,
  }: ApproveRequestParams): Promise<void> {
    const room = await this.rooms.getRoom(roomId);

    await this.auth.authorize({
      user: authenticatedUser,
      subject: room,
      action: Role.Manage,
    });

    const invitedUser = await this.users.findUser(email);

    if (!invitedUser) {
      const message: DraftMessage = {
        content: `No user exists with email ${email}`,
        roomId: room.id,
        authorId: 'system',
        recipientId: authenticatedUser.id,
      };

      await this.dispatcher.send(message);
      return;
    }

    const memberships = await this.memberships.getMemberships(invitedUser.id);
    const status = getMembershipStatus(roomId, memberships);

    if (status === MembershipStatus.Joined) {
      const message: DraftMessage = {
        content: `${invitedUser.name} is already a member of this room`,
        roomId: room.id,
        authorId: 'system',
        recipientId: authenticatedUser.id,
      };

      await this.dispatcher.send(message);
      return;
    } else if (status !== MembershipStatus.PendingApproval) {
      const message: DraftMessage = {
        content: `${invitedUser.name} does not have a pending request to join this room`,
        roomId: room.id,
        authorId: 'system',
        recipientId: authenticatedUser.id,
      };

      await this.dispatcher.send(message);
      return;
    }

    await this.memberships.createMembership({
      userId: invitedUser.id,
      roomId,
      status: MembershipStatus.Joined,
    });

    const message: DraftMessage = {
      content: `${authenticatedUser.name} approved ${invitedUser.name} to join the room`,
      roomId: room.id,
      authorId: 'system',
    };

    await this.dispatcher.send(message);
  }
}
