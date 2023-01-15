import { Room } from '@entities/room.entitiy';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { RoomsRepository } from './repositories/rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepo: RoomsRepository) {}

  async createRoom(owner: User): Promise<Room> {
    return this.roomsRepo.createRoom(owner.id);
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.roomsRepo.getRoom(roomId);
  }
}
