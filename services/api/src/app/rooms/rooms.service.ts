import { ContentPolicy, JoinPolicy, Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { faker } from '@faker-js/faker';
import { MembershipsRepository } from '@entities/memberships.repository';
import { MembershipStatus } from '@entities/membership.entity';
import { AuthService, Role } from '@entities/auth';

const titleCase = (s: string): string => {
  const titleCaseWord = (word: string) =>
    word[0].toUpperCase() + word.substring(1);
  return s.split(' ').map(titleCaseWord).join(' ');
};

export type RoomResult = {
  room: Room;
  roles: Role[];
};

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepo: RoomsRepository,
    private readonly membershipsRepo: MembershipsRepository,
    private readonly authService: AuthService,
  ) {}

  async createRoom(owner: User): Promise<Room> {
    const name = `${faker.word.adjective()} ${faker.color.human()} ${faker.animal.dog()}`;
    const room = await this.roomsRepo.createRoom({
      ownerId: owner.id,
      name: titleCase(name),
      contentPolicy: ContentPolicy.Private,
      joinPolicy: JoinPolicy.Invite,
    });
    await this.membershipsRepo.createMembership({
      userId: owner.id,
      roomId: room.id,
      status: MembershipStatus.Joined,
    });
    return room;
  }

  async getRoom(roomId: string, user: User): Promise<RoomResult> {
    const room = await this.roomsRepo.getRoom(roomId);
    const roles = await this.authService.authorizedRoles({
      user,
      subject: room,
    });
    return { room, roles };
  }

  async joinRoom(roomId: string, user: User): Promise<void> {
    await this.membershipsRepo.createMembership({
      userId: user.id,
      roomId,
      status: MembershipStatus.Joined,
    });
  }
}
