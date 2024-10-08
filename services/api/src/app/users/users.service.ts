import { getActiveRooms } from '@entities/memberships/membership';
import { MembershipsRepository } from '@entities/memberships/memberships-repository';
import { Room } from '@entities/rooms/room';
import { RoomsRepository } from '@entities/rooms/rooms-repository';
import { systemUser } from '@entities/users/system-user';
import { User } from '@entities/users/user';
import { UsersRepository } from '@entities/users/users-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly roomsRepo: RoomsRepository,
    private readonly membershipsRepo: MembershipsRepository,
  ) {}

  async getUser(userId: string): Promise<User> {
    if (userId === 'system') {
      return systemUser;
    }
    return await this.usersRepo.getUser(userId);
  }

  async getUserRooms(userId: string): Promise<Room[]> {
    const memberships = await this.membershipsRepo.getMemberships(userId);
    const roomIds = getActiveRooms(memberships);
    const rooms = await Promise.all(
      roomIds.map((roomId) => this.roomsRepo.getRoom(roomId)),
    );
    return rooms;
  }
}
