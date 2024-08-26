import { JoinPolicy } from '@entities/room.entity';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestMembershipsRepository } from '@data/repositories/test/test.memberships.repository';
import { TestRoomsRepository } from '@data/repositories/test/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { JoinRoomUseCase } from './join';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import mock, { MockProxy } from 'jest-mock-extended/lib/Mock';
import { Dispatcher } from '@entities/messages/message';

describe('JoinRoomUseCase', () => {
  let join: JoinRoomUseCase;
  let rooms: TestRoomsRepository;
  let memberships: TestMembershipsRepository;
  let auth: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const user = UserFactory.build({
    name: 'Joe Bloggs',
    email: 'joe.bloggs@example.com',
  });

  const now = new Date(1000);

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    memberships = new TestMembershipsRepository();
    auth = new TestAuthService(mock<AppLogger>());
    dispatcher = mock<Dispatcher>();
    join = new JoinRoomUseCase(rooms, memberships, auth, dispatcher);
    jest.useFakeTimers({ now });
  });

  it('assigns a membership with status = "Joined" when the join policy is "anyone"', async () => {
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

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'Joe Bloggs joined the room. Welcome!',
      authorId: 'system',
      roomId: room.id,
    });
  });

  it('assigns a membership with status = "PendingApproval" when the join policy is "request"', async () => {
    const room = RoomFactory.build({
      joinPolicy: JoinPolicy.Request,
    });
    rooms.setData([room]);
    auth.stubPermission({ user, subject: room, action: Role.Join });

    await join.exec(room.id, user);

    expect(memberships.getData()).toEqual([
      {
        userId: user.id,
        roomId: room.id,
        status: 'PendingApproval',
        from: now.getTime(),
      },
    ]);

    expect(dispatcher.send).toHaveBeenCalledWith({
      content:
        'Joe Bloggs (joe.bloggs@example.com) requested approval to join the room',
      authorId: 'system',
      roomId: room.id,
      recipientId: room.ownerId,
    });
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
