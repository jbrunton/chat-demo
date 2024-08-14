import { AuthService, Role } from '@usecases/auth.service';
import { MembershipStatus } from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Dispatcher, DraftMessage } from '@entities/messages/message';

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

    await this.memberships.createMembership({
      userId: user.id,
      roomId,
      status: MembershipStatus.Joined,
    });

    const message: DraftMessage = {
      content: `${user.name} joined the room. Welcome!`,
      roomId: room.id,
      authorId: 'system',
    };

    await this.dispatcher.send(message);
  }
}
