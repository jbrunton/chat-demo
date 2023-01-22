import { Room } from '@entities/room.entity';
import { CreateRoomParams, RoomsRepository } from '@entities/rooms.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { pick } from 'rambda';
import { DynamoDBAdapter } from '../adapters/dynamodb.adapter';
import { DbRoom } from '../adapters/schema';

@Injectable()
export class DynamoDBRoomsRepository extends RoomsRepository {
  constructor(private readonly adapter: DynamoDBAdapter) {
    super();
  }

  override async createRoom(params: CreateRoomParams): Promise<Room> {
    const room = await this.adapter.Room.create(params, { hidden: true });
    return roomFromRecord(room);
  }

  override async getRoom(id: string): Promise<Room> {
    const room = await this.adapter.Room.get(
      { Id: id, Sort: 'room' },
      { hidden: true },
    );
    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }
    return roomFromRecord(room);
  }
}

const roomFromRecord = (record: DbRoom): Room => ({
  id: record.Id,
  ...pick(['name', 'ownerId'], record),
});
