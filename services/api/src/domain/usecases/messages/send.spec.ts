import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { UserFactory } from '@fixtures/messages/user.factory';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { Role } from '@entities/auth';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { UnauthorizedException } from '@nestjs/common';
import { SendMessageUseCase } from './send';
import { Dispatcher, DraftMessage, Message } from '@entities/message.entity';
import { mock, MockProxy } from 'jest-mock-extended';

describe('SendMessageUseCase', () => {
  let sendMessage: SendMessageUseCase;
  let rooms: TestRoomsRepository;
  let messages: TestMessagesRepository;
  let authService: TestAuthService;
  let dispatcher: MockProxy<Dispatcher>;

  const room = RoomFactory.build();
  const roomId = room.id;
  const user = UserFactory.build();

  const now = new Date(1001);

  const draft: DraftMessage = {
    roomId,
    content: 'Hello, World!',
    authorId: user.id,
  };

  beforeEach(async () => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    messages = new TestMessagesRepository();

    authService = new TestAuthService();
    dispatcher = mock<Dispatcher>();

    sendMessage = new SendMessageUseCase(
      rooms,
      messages,
      dispatcher,
      authService,
    );

    jest.useFakeTimers({ now });
  });

  it('stores messages', async () => {
    authService.stubPermission({ user, subject: room, action: Role.Write });

    await sendMessage.exec(draft, user);

    const expectedMessage: Message = {
      id: 'message:1001',
      ...draft,
      time: now.getTime(),
    };
    expect(dispatcher.emit).toHaveBeenCalledWith(expectedMessage);
    expect(messages.getData()).toEqual([expectedMessage]);
  });

  it('authorizes the user', async () => {
    await expect(sendMessage.exec(draft, user)).rejects.toEqual(
      new UnauthorizedException(
        'You do not have permission to post to this room.',
      ),
    );
  });
});
