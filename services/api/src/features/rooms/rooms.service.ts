import { Room } from '@entities/room.entitiy';
import { UsersRepository } from '@features/messages/repositories/users.repository';
import { AuthInfo } from '@lib/auth/identity/auth-info';
import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './repositories/rooms.repository';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepo: RoomsRepository,
    private readonly usersRepos: UsersRepository,
  ) {}

  async createRoom(ownerAuth: AuthInfo): Promise<Room> {
    const owner = await this.usersRepos.storeUser(ownerAuth);
    return this.roomsRepo.createRoom(owner.id);
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.roomsRepo.getRoom(roomId);
  }
}
