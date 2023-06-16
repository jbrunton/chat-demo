import { Role } from '@entities/auth';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { GetRoomUseCase } from './get';
import { AppLogger } from '@app/app.logger';

describe('GetRoomUseCase', () => {
  let get: GetRoomUseCase;
  let rooms: TestRoomsRepository;
  let auth: TestAuthService;

  const user = UserFactory.build();
  const room = RoomFactory.build();

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);
    auth = new TestAuthService(new AppLogger());
    get = new GetRoomUseCase(rooms, auth);
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
});
