import { find, reject } from 'rambda';
import { NotFoundException } from '@nestjs/common';
import {
  CreateRoomParams,
  RoomsRepository,
  UpdateRoomParams,
} from '@entities/rooms/rooms-repository';
import { Room } from '@entities/rooms/room';
import { faker } from '@faker-js/faker';
import { subject } from '@casl/ability';

export class TestRoomsRepository extends RoomsRepository {
  private rooms: Room[] = [];

  getData() {
    return this.rooms;
  }

  setData(rooms: Room[]) {
    this.rooms = rooms;
  }

  override async createRoom(params: CreateRoomParams): Promise<Room> {
    const room = {
      id: `room:${faker.random.numeric(8)}`,
      ...params,
    };
    this.rooms.push(room);
    return asRoom(room);
  }

  override async getRoom(roomId: string): Promise<Room> {
    const room = find((room) => roomId === room.id, this.rooms);
    if (!room) {
      throw new NotFoundException(`Room ${roomId} does not exist`);
    }
    return asRoom(room);
  }

  override async updateRoom(params: UpdateRoomParams): Promise<Room> {
    const room = find((room) => params.id === room.id, this.rooms);
    if (!room) {
      throw new NotFoundException(`Room ${params.id} does not exist`);
    }
    const updatedRoom = {
      ...room,
      ...params,
    };
    this.rooms = [
      ...reject((room) => params.id === room.id, this.rooms),
      updatedRoom,
    ];
    return asRoom(updatedRoom);
  }
}

const asRoom = (room: Room) => subject('Room', room);
