import { MembershipStatus } from '@entities/membership.entity';
import { MembershipsRepository } from '@entities/memberships.repository';
import { ContentPolicy, JoinPolicy, Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/users';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly memberships: MembershipsRepository,
  ) {}

  async exec(owner: User): Promise<Room> {
    const name = `${faker.word.adjective()} ${faker.color.human()} ${faker.animal.dog()}`;
    const room = await this.rooms.createRoom({
      ownerId: owner.id,
      name: titleCase(name),
      contentPolicy: ContentPolicy.Private,
      joinPolicy: JoinPolicy.Anyone,
    });
    await this.memberships.createMembership({
      userId: owner.id,
      roomId: room.id,
      status: MembershipStatus.Joined,
    });
    return room;
  }
}

const titleCase = (s: string): string => {
  const titleCaseWord = (word: string) =>
    word[0].toUpperCase() + word.substring(1);
  return s.split(' ').map(titleCaseWord).join(' ');
};
