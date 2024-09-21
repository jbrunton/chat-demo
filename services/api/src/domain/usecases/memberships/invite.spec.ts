import { JoinPolicy } from '@entities/rooms/room';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestMembershipsRepository } from '@data/repositories/test/test.memberships.repository';
import { TestRoomsRepository } from '@data/repositories/test/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import mock, { MockProxy } from 'jest-mock-extended/lib/Mock';
import { Dispatcher } from '@entities/messages/message';
import { InviteUseCase } from './invite';
import { TestUsersRepository } from '@data/repositories/test/test.users.repository';
import { MembershipStatus } from '@entities/memberships/membership';

describe('InviteUseCase', () => {
  let invite: InviteUseCase;
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

    invite = new InviteUseCase(rooms, users, memberships, auth, dispatcher);

    jest.useFakeTimers({ now });
  });

  it('invites a user to the room', async () => {
    await invite.exec({
      authenticatedUser: owner,
      roomId: room.id,
      email: otherUser.email,
    });

    expect(memberships.getData()).toEqual([
      {
        userId: otherUser.id,
        roomId: room.id,
        status: MembershipStatus.PendingInvite,
        from: now.getTime(),
      },
    ]);

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'Alice invited Bob to join the room',
      authorId: 'system',
      roomId: room.id,
    });
  });

  it('authorizes the user', async () => {
    await expect(
      invite.exec({
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
    await invite.exec({
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

    await invite.exec({
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

  it('checks the user does not already have an invite', async () => {
    await memberships.setData([
      {
        from: 0,
        roomId: room.id,
        userId: otherUser.id,
        status: MembershipStatus.PendingInvite,
      },
    ]);

    await invite.exec({
      authenticatedUser: owner,
      roomId: room.id,
      email: otherUser.email,
    });

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'Bob already has an invite to this room',
      authorId: 'system',
      roomId: room.id,
      recipientId: owner.id,
    });
  });
});
