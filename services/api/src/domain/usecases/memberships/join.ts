import { AuthService, Role } from '@usecases/auth.service';
import { MembershipStatus } from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/users';
import { Injectable } from '@nestjs/common';
import { Dispatcher, DraftMessage } from '@entities/messages';
import { JoinPolicy } from '@entities/room.entity';

@Injectable()
export class JoinRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly memberships: MembershipsRepository,
    private readonly authService: AuthService,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec(roomId: string, user: User): Promise<void> {
    const room = await this.rooms.getRoom(roomId);

    await this.authService.authorize({
      user,
      action: Role.Join,
      subject: room,
    });

    const status =
      room.joinPolicy === JoinPolicy.Request
        ? MembershipStatus.PendingApproval
        : MembershipStatus.Joined;

    await this.memberships.createMembership({
      userId: user.id,
      roomId,
      status,
    });

    const messageContent =
      room.joinPolicy === JoinPolicy.Request
        ? `${user.name} (${user.email}) requested approval to join the room`
        : `${user.name} joined the room. Welcome!`;

    const recipientId =
      room.joinPolicy === JoinPolicy.Request ? room.ownerId : undefined;

    const message: DraftMessage = {
      content: messageContent,
      roomId: room.id,
      authorId: 'system',
      recipientId,
    };

    await this.dispatcher.send(message);
  }
}
