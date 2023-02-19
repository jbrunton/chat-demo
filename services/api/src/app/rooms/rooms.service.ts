import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { faker } from '@faker-js/faker';
import { MembershipsRepository } from '@entities/memberships.repository';
import { MembershipStatus } from '@entities/membership.entity';

const titleCase = (s: string): string => {
  const titleCaseWord = (word: string) =>
    word[0].toUpperCase() + word.substring(1);
  return s.split(' ').map(titleCaseWord).join(' ');
};

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepo: RoomsRepository,
    private readonly membershipsRepo: MembershipsRepository,
  ) {}

  async createRoom(owner: User): Promise<Room> {
    const name = `${faker.word.adjective()} ${faker.color.human()} ${faker.animal.dog()}`;
    const room = await this.roomsRepo.createRoom({
      ownerId: owner.id,
      name: titleCase(name),
    });
    await this.membershipsRepo.createMembership({
      userId: owner.id,
      roomId: room.id,
      status: MembershipStatus.Joined,
    });
    return room;
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.roomsRepo.getRoom(roomId);
  }

  async joinRoom(roomId: string, user: User): Promise<void> {
    await this.membershipsRepo.createMembership({
      userId: user.id,
      roomId,
      status: MembershipStatus.Joined,
    });
  }
}
