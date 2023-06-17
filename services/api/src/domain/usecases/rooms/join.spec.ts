import { JoinPolicy } from '@entities/room.entity';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestMembershipsRepository } from '@fixtures/data/test.memberships.repository';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { JoinRoomUseCase } from './join';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import mock from 'jest-mock-extended/lib/Mock';

describe('JoinRoomUseCase', () => {
  let join: JoinRoomUseCase;
  let rooms: TestRoomsRepository;
  let memberships: TestMembershipsRepository;
  let auth: TestAuthService;

  const user = UserFactory.build();

  const now = new Date(1000);

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    memberships = new TestMembershipsRepository();
    auth = new TestAuthService(mock<AppLogger>());
    join = new JoinRoomUseCase(rooms, memberships, auth);
    jest.useFakeTimers({ now });
  });

  it('assigns a membership to the user', async () => {
    const room = RoomFactory.build({
      joinPolicy: JoinPolicy.Anyone,
    });
    rooms.setData([room]);
    auth.stubPermission({ user, subject: room, action: Role.Join });

    await join.exec(room.id, user);

    expect(memberships.getData()).toEqual([
      {
        userId: user.id,
        roomId: room.id,
        status: 'Joined',
        from: now.getTime(),
      },
    ]);
  });

  it('authorizes the user', async () => {
    const room = RoomFactory.build({
      joinPolicy: JoinPolicy.Invite,
    });
    rooms.setData([room]);

    await expect(join.exec(room.id, user)).rejects.toEqual(
      new UnauthorizedException(
        'You do not have permission to perform this action.',
      ),
    );
  });
});
