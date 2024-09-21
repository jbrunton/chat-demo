import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestRoomsRepository } from '@data/repositories/test/test.rooms.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { Dispatcher } from '@entities/messages/message';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import { ConfigureRoomUseCase } from './configure-room';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';

describe('ChangeRoomJoinPolicyUseCase', () => {
  let changeRoomJoinPolicy: ConfigureRoomUseCase;
  let rooms: TestRoomsRepository;
  let auth: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const originalJoinPolicy = JoinPolicy.Invite;
  const newJoinPolicy = JoinPolicy.Anyone;

  const originalContentPolicy = ContentPolicy.Private;
  const newContentPolicy = ContentPolicy.Public;

  const owner = UserFactory.build();
  const otherUser = UserFactory.build();
  const room = RoomFactory.build({
    joinPolicy: originalJoinPolicy,
    contentPolicy: originalContentPolicy,
  });

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    auth = new TestAuthService(mock<AppLogger>());
    auth.stubPermission({ user: owner, subject: room, action: Role.Manage });

    dispatcher = mock<Dispatcher>();

    changeRoomJoinPolicy = new ConfigureRoomUseCase(rooms, auth, dispatcher);
  });

  describe('when given a new join policy', () => {
    it('updates the join policy', async () => {
      await changeRoomJoinPolicy.exec({
        roomId: room.id,
        authenticatedUser: owner,
        newJoinPolicy,
      });

      const updatedRoom = await rooms.getRoom(room.id);
      expect(updatedRoom.joinPolicy).toEqual(newJoinPolicy);
    });

    it('sends a notification', async () => {
      await changeRoomJoinPolicy.exec({
        roomId: room.id,
        authenticatedUser: owner,
        newJoinPolicy,
      });

      expect(dispatcher.send).toHaveBeenCalledWith({
        content: 'Room join policy updated to anyone',
        authorId: 'system',
        roomId: room.id,
        updatedEntities: ['room'],
      });
    });
  });

  describe('when given a new content policy', () => {
    it('updates the join policy', async () => {
      await changeRoomJoinPolicy.exec({
        roomId: room.id,
        authenticatedUser: owner,
        newContentPolicy,
      });

      const updatedRoom = await rooms.getRoom(room.id);
      expect(updatedRoom.contentPolicy).toEqual(newContentPolicy);
    });

    it('sends a notification', async () => {
      await changeRoomJoinPolicy.exec({
        roomId: room.id,
        authenticatedUser: owner,
        newContentPolicy,
      });

      expect(dispatcher.send).toHaveBeenCalledWith({
        content: 'Room content policy updated to public',
        authorId: 'system',
        roomId: room.id,
        updatedEntities: ['room'],
      });
    });
  });

  it('authorizes the user', async () => {
    await expect(
      changeRoomJoinPolicy.exec({
        roomId: room.id,
        authenticatedUser: otherUser,
        newJoinPolicy,
      }),
    ).rejects.toEqual(
      new UnauthorizedException(
        'You cannot configure policies for this room. Only the owner can do this.',
      ),
    );

    const updatedRoom = await rooms.getRoom(room.id);
    expect(updatedRoom.joinPolicy).toEqual(originalJoinPolicy);
  });
});
