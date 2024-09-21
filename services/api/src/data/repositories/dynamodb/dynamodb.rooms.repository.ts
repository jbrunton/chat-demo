import { subject } from '@casl/ability';
import { Room } from '@entities/rooms/room';
import {
  CreateRoomParams,
  RoomsRepository,
  UpdateRoomParams,
} from '@entities/rooms/rooms-repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { pick } from 'rambda';
import { DynamoDBAdapter } from '../../adapters/dynamodb/dynamodb.adapter';
import { DbRoom } from '../../adapters/dynamodb/schema';

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

  override async updateRoom(params: UpdateRoomParams): Promise<Room> {
    const { id, ...rest } = params;
    const room = await this.adapter.Room.get(
      { Id: id, Sort: 'room' },
      { hidden: true },
    );
    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }
    const result = await this.adapter.Room.update(
      {
        Id: id,
        Sort: 'room',
        ...rest,
      },
      { hidden: true },
    );
    return roomFromRecord(result);
  }
}

const roomFromRecord = (record: DbRoom): Room =>
  subject('Room', {
    id: record.Id,
    ...pick(['name', 'ownerId', 'contentPolicy', 'joinPolicy'], record),
  });
