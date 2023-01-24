import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepo: RoomsRepository) {}

  async createRoom(owner: User): Promise<Room> {
    return this.roomsRepo.createRoom({
      ownerId: owner.id,
      name: 'Test Room',
    });
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.roomsRepo.getRoom(roomId);
  }
}
