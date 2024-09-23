import { AuthService, Role } from '@usecases/auth-service';
import { Room } from '@entities/rooms/room';
import { RoomsRepository } from '@entities/rooms/rooms-repository';
import { User } from '@entities/users/user';
import { Injectable } from '@nestjs/common';
import { MembershipsRepository } from '@entities/memberships/memberships-repository';
import {
  MembershipStatus,
  getMembershipStatus,
} from '@entities/memberships/membership';

export type RoomDetails = {
  room: Room;
  roles: Role[];
  status: MembershipStatus;
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
    const status = getMembershipStatus(roomId, memberships);

    return { room, roles, status };
  }
}
