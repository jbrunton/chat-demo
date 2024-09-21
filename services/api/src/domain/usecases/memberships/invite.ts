import { AuthService, Role } from '@usecases/auth.service';
import {
  MembershipStatus,
  getMembershipStatus,
} from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { Injectable } from '@nestjs/common';
import { Dispatcher, DraftMessage } from '@entities/messages/message';
import { User } from '@entities/users/user';
import { UsersRepository } from '@entities/users/users-repository';

export type InviteParams = {
  roomId: string;
  authenticatedUser: User;
  email: string;
};

@Injectable()
export class InviteUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly users: UsersRepository,
    private readonly memberships: MembershipsRepository,
    private readonly authService: AuthService,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec({
    roomId,
    authenticatedUser,
    email,
  }: InviteParams): Promise<void> {
    const room = await this.rooms.getRoom(roomId);

    await this.authService.authorize({
      user: authenticatedUser,
      action: Role.Manage,
      subject: room,
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
    } else if (status === MembershipStatus.PendingInvite) {
      const message: DraftMessage = {
        content: `${invitedUser.name} already has an invite to this room`,
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
      status: MembershipStatus.PendingInvite,
    });

    const message: DraftMessage = {
      content: `${authenticatedUser.name} invited ${invitedUser.name} to join the room`,
      roomId: room.id,
      authorId: 'system',
    };

    await this.dispatcher.send(message);
  }
}
