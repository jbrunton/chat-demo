import { AuthService, Role } from '@usecases/auth.service';
import { MembershipStatus } from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User, UsersRepository } from '@entities/users';
import { Injectable } from '@nestjs/common';
import { Dispatcher, DraftMessage } from '@entities/messages/message';

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
