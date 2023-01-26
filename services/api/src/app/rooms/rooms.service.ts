import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { faker } from '@faker-js/faker';

const titleCase = (s: string): string => {
  const titleCaseWord = (word: string) =>
    word[0].toUpperCase() + word.substring(1);
  return s.split(' ').map(titleCaseWord).join(' ');
};

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepo: RoomsRepository) {}

  async createRoom(owner: User): Promise<Room> {
    const name = `${faker.word.adjective()} ${faker.color.human()} ${faker.animal.dog()}`;
    return this.roomsRepo.createRoom({
      ownerId: owner.id,
      name: titleCase(name),
    });
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.roomsRepo.getRoom(roomId);
  }
}
