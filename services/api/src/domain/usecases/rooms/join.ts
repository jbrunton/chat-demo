import { AuthService, Role } from '@usecases/auth.service';
import { MembershipStatus } from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JoinRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly memberships: MembershipsRepository,
    private readonly authService: AuthService,
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
  }
}
