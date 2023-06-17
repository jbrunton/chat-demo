import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { UserFactory } from '@fixtures/messages/user.factory';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { Role } from '@entities/auth';
import { GetMessagesUseCase } from './get-messages';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { MessageFactory } from '@fixtures/messages/message.factory';
import { UnauthorizedException } from '@nestjs/common';
import { AppLogger } from '@app/app.logger';

describe('GetMessagesUseCase', () => {
  let getMessages: GetMessagesUseCase;
  let rooms: TestRoomsRepository;
  let messages: TestMessagesRepository;
  let authService: TestAuthService;

  const room = RoomFactory.build();
  const roomId = room.id;
  const user = UserFactory.build();

  const publicMessage = MessageFactory.build({ roomId });
  const privateMessage = MessageFactory.build({ roomId, recipientId: user.id });

  beforeEach(async () => {
    rooms = new TestRoomsRepository();
    rooms.setData([room]);

    messages = new TestMessagesRepository();
    messages.setData([publicMessage, privateMessage]);

    authService = new TestAuthService(new AppLogger());

    getMessages = new GetMessagesUseCase(rooms, messages, authService);
  });

  it('returns public messages', async () => {
    authService.stubPermission({ user, subject: room, action: Role.Read });
    const messages = await getMessages.exec(roomId, user);
    expect(messages).toEqual([publicMessage]);
  });

  it('authorizes the user', async () => {
    await expect(getMessages.exec(roomId, user)).rejects.toEqual(
      new UnauthorizedException(
        'You do not have permission to perform this action.',
      ),
    );
  });
});
