import { UserFactory } from '@fixtures/messages/user.factory';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { UnauthorizedException } from '@nestjs/common';
import { SendMessageUseCase } from './send';
import { Dispatcher, DraftMessage } from '@entities/message.entity';
import { mock, MockProxy } from 'jest-mock-extended';
import { AppLogger } from '@app/app.logger';
import { Role } from '@usecases/auth.service';

describe('SendMessageUseCase', () => {
  let sendMessage: SendMessageUseCase;
  let rooms: TestRoomsRepository;
  let authService: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const room = RoomFactory.build();
  const roomId = room.id;
  const user = UserFactory.build();

  const draft: DraftMessage = {
    roomId,
    content: 'Hello, World!',
    authorId: user.id,
  };

  beforeEach(async () => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    authService = new TestAuthService(new AppLogger());
    dispatcher = mock<Dispatcher>();

    sendMessage = new SendMessageUseCase(rooms, dispatcher, authService);
  });

  it('sends messages', async () => {
    authService.stubPermission({ user, subject: room, action: Role.Write });

    await sendMessage.exec(draft, user);

    expect(dispatcher.send).toHaveBeenCalledWith(draft);
  });

  it('authorizes the user', async () => {
    await expect(sendMessage.exec(draft, user)).rejects.toEqual(
      new UnauthorizedException(
        'You do not have permission to post to this room.',
      ),
    );
  });
});
