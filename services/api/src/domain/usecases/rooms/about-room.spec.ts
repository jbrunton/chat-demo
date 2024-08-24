import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import mock, { MockProxy } from 'jest-mock-extended/lib/Mock';
import { Dispatcher } from '@entities/messages/message';
import { AboutRoomUseCase } from './about-room';
import { TestUsersRepository } from '@fixtures/data/test.users.repository';

describe('AboutRoomUseCase', () => {
  let aboutRoom: AboutRoomUseCase;
  let rooms: TestRoomsRepository;
  let users: TestUsersRepository;
  let auth: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const owner = UserFactory.build({ name: 'Joe Bloggs' });
  const otherUser = UserFactory.build();

  const room = RoomFactory.build({ ownerId: owner.id, name: 'Test Room' });

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    users = new TestUsersRepository();
    users.setData([owner, otherUser]);

    auth = new TestAuthService(mock<AppLogger>());
    dispatcher = mock<Dispatcher>();
    aboutRoom = new AboutRoomUseCase(rooms, users, auth, dispatcher);
  });

  it('describes the room', async () => {
    auth.stubPermission({ user: owner, subject: room, action: Role.Read });

    await aboutRoom.exec({ authenticatedUser: owner, roomId: room.id });

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: [
        'About Test Room:',
        '* Owner: Joe Bloggs',
        '* Content policy: private',
        '* Join policy: invite',
      ].join('\n'),
      authorId: 'system',
      roomId: room.id,
      recipientId: owner.id,
    });
  });

  it('authorizes the user', async () => {
    await expect(
      aboutRoom.exec({ authenticatedUser: otherUser, roomId: room.id }),
    ).rejects.toEqual(
      new UnauthorizedException(
        'You do not have permission to perform this action.',
      ),
    );
  });
});
