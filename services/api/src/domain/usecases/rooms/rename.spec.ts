import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RenameRoomUseCase } from './rename';
import { mock, MockProxy } from 'jest-mock-extended';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { Role } from '@entities/auth';
import { UnauthorizedException } from '@nestjs/common';
import { Dispatcher } from '@entities/message.entity';

describe('RenameRoomUseCase', () => {
  let rename: RenameRoomUseCase;
  let rooms: TestRoomsRepository;
  let messages: TestMessagesRepository;
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
    messages = new TestMessagesRepository();

    auth = new TestAuthService();
    auth.stubPermission({ user: owner, subject: room, action: Role.Manage });

    dispatcher = mock<Dispatcher>();

    rename = new RenameRoomUseCase(rooms, messages, auth, dispatcher);
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

    expect(dispatcher.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Room renamed to New Room Name',
        authorId: 'system',
        roomId: room.id,
        updatedEntities: ['room'],
      }),
    );
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
