import { AuthService, Role } from '@usecases/auth.service';
import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/users';
import { Injectable } from '@nestjs/common';
import { MembershipsRepository } from '@entities/memberships.repository';
import { Membership, forRoom, isCurrent } from '@entities/membership.entity';

export type RoomDetails = {
  room: Room;
  roles: Role[];
  membership?: Membership;
};

@Injectable()
export class GetRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly memberships: MembershipsRepository,
    private readonly authService: AuthService,
  ) {}

  async exec(roomId: string, user: User): Promise<RoomDetails> {
    const room = await this.rooms.getRoom(roomId);

    const roles = await this.authService.authorizedRoles({
      user,
      subject: room,
    });

    const memberships = await this.memberships.getMemberships(user.id);
    const [currentMembership] = memberships
      .filter(forRoom(roomId))
      .filter(isCurrent);

    return { room, roles, membership: currentMembership };
  }
}
