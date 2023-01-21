import { Injectable } from '@nestjs/common';
import { DBAdapter } from '@data/db.adapter';
import { Room } from '@entities/room.entitiy';

@Injectable()
export class RoomsRepository {
  constructor(private readonly db: DBAdapter) {}

  async createRoom(ownerId: string): Promise<Room> {
    const stored = await this.db.createRoom({ ownerId, name: 'foo' });
    console.log('room', { stored });
    return stored;
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.db.getRoom(roomId);
  }
}
