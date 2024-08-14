import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RenameRoomUseCase } from './rename';
import { mock, MockProxy } from 'jest-mock-extended';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { Dispatcher } from '@entities/messages';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';

describe('RenameRoomUseCase', () => {
  let rename: RenameRoomUseCase;
  let rooms: TestRoomsRepository;
  let auth: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const originalName = 'Original Room Name';
  const newName = 'New Room Name';

  const owner = UserFactory.build();
  const otherUser = UserFactory.build();
  const room = RoomFactory.build({ name: originalName });

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    auth = new TestAuthService(mock<AppLogger>());
    auth.stubPermission({ user: owner, subject: room, action: Role.Manage });

    dispatcher = mock<Dispatcher>();

    rename = new RenameRoomUseCase(rooms, auth, dispatcher);
  });

  it('renames the room', async () => {
    await rename.exec({
      roomId: room.id,
      authenticatedUser: owner,
      newName,
    });

    const updatedRoom = await rooms.getRoom(room.id);
    expect(updatedRoom.name).toEqual(newName);
  });

  it('sends a notification', async () => {
    await rename.exec({
      roomId: room.id,
      authenticatedUser: owner,
      newName,
    });

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: 'Room renamed to New Room Name',
      authorId: 'system',
      roomId: room.id,
      updatedEntities: ['room'],
    });
  });

  it('authorizes the user', async () => {
    await expect(
      rename.exec({
        roomId: room.id,
        authenticatedUser: otherUser,
        newName,
      }),
    ).rejects.toEqual(
      new UnauthorizedException(
        'You cannot rename this room. Only the owner can do this.',
      ),
    );

    const updatedRoom = await rooms.getRoom(room.id);
    expect(updatedRoom.name).toEqual(originalName);
  });
});
