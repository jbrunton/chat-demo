import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { UsersRepository } from '@entities/users.repository';
import { AuthInfo } from '@lib/auth/identity/auth-info';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepo: RoomsRepository,
    private readonly usersRepos: UsersRepository,
  ) {}

  async createRoom(ownerAuth: AuthInfo): Promise<Room> {
    const owner = await this.usersRepos.saveUser({
      name: ownerAuth.name ?? 'Anon',
      ...ownerAuth,
    });
    return this.roomsRepo.createRoom({
      ownerId: owner.id,
      name: 'Test Room',
    });
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.roomsRepo.getRoom(roomId);
  }
}
