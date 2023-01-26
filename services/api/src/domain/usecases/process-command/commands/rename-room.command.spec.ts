import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { renameRoom } from './rename-room.command';

describe('renameRoom', () => {
  let roomsRepo: TestRoomsRepository;

  const owner = UserFactory.build();
  const otherUser = UserFactory.build();

  const originalName = 'Some Room';
  const newName = 'New Room Name';

  const room = RoomFactory.build({
    ownerId: owner.id,
    name: originalName,
  });
  const roomId = room.id;

  beforeEach(() => {
    roomsRepo = new TestRoomsRepository();
    roomsRepo.setData([room]);
  });

  it('renames the room', async () => {
    const response = await renameRoom(
      {
        roomId,
        authenticatedUser: owner,
        newName,
      },
      roomsRepo,
    );

    const updatedRoom = await roomsRepo.getRoom(room.id);
    expect(response).toEqual({
      content: 'Room renamed to New Room Name',
      authorId: 'system',
      roomId,
      updatedEntities: ['room'],
    });
    expect(updatedRoom).toMatchObject({
      name: newName,
    });
  });

  it('authorizes the user', async () => {
    const response = await renameRoom(
      {
        roomId,
        authenticatedUser: otherUser,
        newName,
      },
      roomsRepo,
    );

    const updatedRoom = await roomsRepo.getRoom(room.id);
    expect(response).toEqual({
      content: 'You cannot rename this room. Only the owner can do this.',
      authorId: 'system',
      recipientId: otherUser.id,
      roomId,
    });
    expect(updatedRoom).toMatchObject({
      name: originalName,
    });
  });
});
