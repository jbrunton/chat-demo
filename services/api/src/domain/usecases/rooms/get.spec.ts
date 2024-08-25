import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { GetRoomUseCase } from './get';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import { TestMembershipsRepository } from '@fixtures/data/test.memberships.repository';
import { MembershipStatus } from '@entities/membership.entity';

describe('GetRoomUseCase', () => {
  let get: GetRoomUseCase;
  let rooms: TestRoomsRepository;
  let memberships: TestMembershipsRepository;
  let auth: TestAuthService;

  const user = UserFactory.build();
  const room = RoomFactory.build();

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    memberships = new TestMembershipsRepository();

    auth = new TestAuthService(new AppLogger());

    get = new GetRoomUseCase(rooms, memberships, auth);
  });

  it('returns the room', async () => {
    const details = await get.exec(room.id, user);
    expect(details.room).toEqual(room);
  });

  it('returns roles', async () => {
    auth.stubPermission({ user, subject: room, action: Role.Read });
    const details = await get.exec(room.id, user);
    expect(details.roles).toEqual([Role.Read]);
  });

  it('returns the current membership status for the authenticated user', async () => {
    const currentMembership = {
      roomId: room.id,
      userId: user.id,
      status: MembershipStatus.Joined,
      from: 1000,
    };
    memberships.setData([currentMembership]);

    const details = await get.exec(room.id, user);

    expect(details.status).toEqual(MembershipStatus.Joined);
  });
});
