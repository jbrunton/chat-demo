import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { Dispatcher } from '@entities/messages';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';
import { ChangeRoomJoinPolicyUseCase } from './change-room-join-policy';
import { JoinPolicy } from '@entities/room.entity';

describe('ChangeRoomJoinPolicyUseCase', () => {
  let changeRoomJoinPolicy: ChangeRoomJoinPolicyUseCase;
  let rooms: TestRoomsRepository;
  let auth: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const originalJoinPolicy = JoinPolicy.Invite;
  const newJoinPolicy = JoinPolicy.Anyone;

  const owner = UserFactory.build();
  const otherUser = UserFactory.build();
  const room = RoomFactory.build({ joinPolicy: originalJoinPolicy });

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    auth = new TestAuthService(mock<AppLogger>());
    auth.stubPermission({ user: owner, subject: room, action: Role.Manage });

    dispatcher = mock<Dispatcher>();

    changeRoomJoinPolicy = new ChangeRoomJoinPolicyUseCase(
      rooms,
      auth,
      dispatcher,
    );
  });

  it('renames the room', async () => {
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

  it('authorizes the user', async () => {
    await expect(
      changeRoomJoinPolicy.exec({
        roomId: room.id,
        authenticatedUser: otherUser,
        newJoinPolicy,
      }),
    ).rejects.toEqual(
      new UnauthorizedException(
        `You cannot change this room's join policy. Only the owner can do this.`,
      ),
    );

    const updatedRoom = await rooms.getRoom(room.id);
    expect(updatedRoom.joinPolicy).toEqual(originalJoinPolicy);
  });
});
