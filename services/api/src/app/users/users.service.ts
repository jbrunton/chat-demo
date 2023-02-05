import { MembershipStatus } from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { UsersRepository } from '@entities/users.repository';
import { Injectable } from '@nestjs/common';
import { filter, pluck, uniq } from 'rambda';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly roomsRepo: RoomsRepository,
    private readonly membershipsRepo: MembershipsRepository,
  ) {}

  async getUser(userId: string): Promise<User> {
    if (userId === 'system') {
      return {
        id: 'system',
        name: 'System',
      };
    }
    return await this.usersRepo.getUser(userId);
  }

  async getUserRooms(userId: string): Promise<Room[]> {
    const memberships = await this.membershipsRepo.getMemberships(userId);
    const activeMemberships = filter(
      (m) => !m.until && m.status === MembershipStatus.Joined,
      memberships,
    );
    const roomIds = uniq(pluck('roomId', activeMemberships));
    const rooms = await Promise.all(
      roomIds.map((roomId) => this.roomsRepo.getRoom(roomId)),
    );
    return rooms;
  }
}
