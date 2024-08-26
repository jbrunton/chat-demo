import { JoinPolicy } from '@entities/room.entity';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestMembershipsRepository } from '@fixtures/data/test.memberships.repository';
import { TestRoomsRepository } from '@data/repositories/test/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import mock, { MockProxy } from 'jest-mock-extended/lib/Mock';
import { Dispatcher, UpdatedEntity } from '@entities/messages/message';
import { LeaveRoomUseCase } from './leave';
import { MembershipStatus } from '@entities/membership.entity';

describe('LeaveRoomUseCase', () => {
  let leave: LeaveRoomUseCase;
  let rooms: TestRoomsRepository;
  let memberships: TestMembershipsRepository;
  let auth: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const user = UserFactory.build({ name: 'Joe Bloggs' });

  const now = new Date(1000);

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    memberships = new TestMembershipsRepository();
    auth = new TestAuthService(mock<AppLogger>());
    dispatcher = mock<Dispatcher>();
    leave = new LeaveRoomUseCase(rooms, memberships, dispatcher);
    jest.useFakeTimers({ now });
  });

  it('assigns a membership to the user', async () => {
    const room = RoomFactory.build({
      joinPolicy: JoinPolicy.Anyone,
    });
    rooms.setData([room]);
    auth.stubPermission({ user, subject: room, action: Role.Read });

    await leave.exec({ authenticatedUser: user, roomId: room.id });

    expect(memberships.getData()).toEqual([
      {
        userId: user.id,
        roomId: room.id,
        status: MembershipStatus.Revoked,
        from: now.getTime(),
      },
    ]);

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'Joe Bloggs left the room.',
      authorId: 'system',
      roomId: room.id,
      updatedEntities: [UpdatedEntity.Room, UpdatedEntity.Users],
    });
  });
});
