import { Room } from '@entities/room.entity';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { renameRoom } from './rename-room.command';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { UnauthorizedException } from '@nestjs/common';

describe('renameRoom', () => {
  let roomsRepo: TestRoomsRepository;
  let authService: TestAuthService;

  const owner = UserFactory.build();
  const otherUser = UserFactory.build();

  const originalName = 'Some Room';
  const newName = 'New Room Name';

  let room: Room;
  let roomId: string;

  beforeEach(async () => {
    roomsRepo = new TestRoomsRepository();
    authService = new TestAuthService();
    room = RoomFactory.build({
      ownerId: owner.id,
      name: originalName,
    });
    roomId = room.id;
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
      authService,
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
    authService.stubFailure({
      user: otherUser,
      room,
      action: 'manage',
    });

    await expect(
      renameRoom(
        {
          roomId,
          authenticatedUser: otherUser,
          newName,
        },
        roomsRepo,
        authService,
      ),
    ).rejects.toEqual(
      new UnauthorizedException(
        'You cannot rename this room. Only the owner can do this.',
      ),
    );

    const updatedRoom = await roomsRepo.getRoom(room.id);
    expect(updatedRoom).toMatchObject({
      name: originalName,
    });
  });
});
