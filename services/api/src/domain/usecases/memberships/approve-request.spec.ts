import { JoinPolicy } from '@entities/room.entity';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestMembershipsRepository } from '@fixtures/data/test.memberships.repository';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import mock, { MockProxy } from 'jest-mock-extended/lib/Mock';
import { Dispatcher } from '@entities/messages/message';
import { TestUsersRepository } from '@fixtures/data/test.users.repository';
import { MembershipStatus, isCurrent } from '@entities/membership.entity';
import { ApproveRequestUseCase } from './approve-request';

describe('ApproveRequestUseCase', () => {
  let approveRequest: ApproveRequestUseCase;
  let rooms: TestRoomsRepository;
  let users: TestUsersRepository;
  let memberships: TestMembershipsRepository;
  let auth: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const owner = UserFactory.build({ name: 'Alice' });
  const otherUser = UserFactory.build({ name: 'Bob' });
  const room = RoomFactory.build({ joinPolicy: JoinPolicy.Invite });

  const now = new Date(1000);

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    users = new TestUsersRepository();
    users.setData([owner, otherUser]);

    memberships = new TestMembershipsRepository();

    auth = new TestAuthService(mock<AppLogger>());
    auth.stubPermission({ user: owner, subject: room, action: Role.Manage });

    dispatcher = mock<Dispatcher>();

    approveRequest = new ApproveRequestUseCase(
      rooms,
      users,
      memberships,
      auth,
      dispatcher,
    );

    jest.useFakeTimers({ now });
  });

  it('approves pending requests', async () => {
    memberships.setData([
      {
        userId: otherUser.id,
        roomId: room.id,
        status: MembershipStatus.PendingApproval,
        from: 0,
      },
    ]);

    await approveRequest.exec({
      authenticatedUser: owner,
      roomId: room.id,
      email: otherUser.email,
    });

    expect(memberships.getData().filter(isCurrent)).toEqual([
      {
        userId: otherUser.id,
        roomId: room.id,
        status: MembershipStatus.Joined,
        from: now.getTime(),
      },
    ]);

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'Alice approved Bob to join the room',
      authorId: 'system',
      roomId: room.id,
    });
  });

  it('authorizes the user', async () => {
    await expect(
      approveRequest.exec({
        authenticatedUser: otherUser,
        roomId: room.id,
        email: otherUser.email,
      }),
    ).rejects.toEqual(
      new UnauthorizedException(
        'You do not have permission to perform this action.',
      ),
    );
  });

  it('checks the user exists', async () => {
    await approveRequest.exec({
      authenticatedUser: owner,
      roomId: room.id,
      email: 'not-a-user@example.com',
    });

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'No user exists with email not-a-user@example.com',
      authorId: 'system',
      roomId: room.id,
      recipientId: owner.id,
    });
  });

  it('checks the user is not already a member', async () => {
    await memberships.setData([
      {
        from: 0,
        roomId: room.id,
        userId: otherUser.id,
        status: MembershipStatus.Joined,
      },
    ]);

    await approveRequest.exec({
      authenticatedUser: owner,
      roomId: room.id,
      email: otherUser.email,
    });

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'Bob is already a member of this room',
      authorId: 'system',
      roomId: room.id,
      recipientId: owner.id,
    });
  });

  it('checks the user has a pending invite', async () => {
    await approveRequest.exec({
      authenticatedUser: owner,
      roomId: room.id,
      email: otherUser.email,
    });

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'Bob does not have a pending request to join this room',
      authorId: 'system',
      roomId: room.id,
      recipientId: owner.id,
    });
  });
});
