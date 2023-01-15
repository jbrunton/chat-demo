import { Injectable, NotFoundException } from '@nestjs/common';
import { DBAdapter, DBItem } from '@data/db.adapter';
import { getRandomString } from '@lib/util';
import { Room } from '@entities/room.entitiy';

const newRoomId = () => {
  const rand = getRandomString();
  return `room_${rand}`;
};

type RoomData = {
  ownerId: string;
};

type RoomItem = DBItem<RoomData>;

@Injectable()
export class RoomsRepository {
  constructor(private readonly db: DBAdapter) {}

  async createRoom(ownerId: string): Promise<Room> {
    const roomId = newRoomId();
    const data = {
      ownerId,
    };
    const item: RoomItem = {
      Id: roomId,
      Sort: 'Room',
      Data: data,
      Type: 'Room',
    };
    await this.db.putItem(item);
    return {
      id: roomId,
      ...data,
    };
  }

  async getRoom(roomId: string): Promise<Room> {
    const params = {
      KeyConditionExpression: 'Id = :roomId and Sort = :filter',
      ExpressionAttributeValues: {
        ':roomId': roomId,
        ':filter': 'Room',
      },
    };
    const [roomItem] = await this.db.query<RoomData>(params);
    if (!roomItem) {
      throw new NotFoundException(`Could not find room ${roomId}`);
    }
    return {
      id: roomItem.Id,
      ownerId: roomItem.Data.ownerId,
    };
  }
}
