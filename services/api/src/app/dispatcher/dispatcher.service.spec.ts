import { TestRoomsRepository } from '@data/repositories/test/test.rooms.repository';
import { DispatcherService } from './dispatcher.service';
import { TestMessagesRepository } from '@data/repositories/test/test.messages.repository';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { DraftMessage, SentMessage } from '@entities/messages';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { MockProxy, mock } from 'jest-mock-extended';
import { EventEmitter } from 'stream';
import { AppLogger } from '@app/app.logger';

describe('DispatcherService', () => {
  let dispatcher: DispatcherService;

  let rooms: TestRoomsRepository;
  let messages: TestMessagesRepository;
  let auth: TestAuthService;
  let roomId: string;
  let authorId: string;
  let recipientId: string;
  let emitter: MockProxy<EventEmitter>;

  const now = new Date();

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    messages = new TestMessagesRepository();
    auth = new TestAuthService(new AppLogger());
    emitter = mock<EventEmitter>();

    roomId = RoomFactory.id();
    authorId = UserFactory.id();
    recipientId = UserFactory.id();

    dispatcher = new DispatcherService(
      messages,
      rooms,
      auth,
      emitter,
      mock<AppLogger>(),
    );

    jest.useFakeTimers({ now });
  });

  describe('#send', () => {
    it('stores and sends public messages', async () => {
      const draft: DraftMessage = {
        content: 'Hello, World!',
        roomId,
        authorId,
      };

      await dispatcher.send(draft);

      const expectedMessage: SentMessage = {
        id: `message:${now.getTime()}`,
        time: now.getTime(),
        ...draft,
      };
      expect(emitter.emit).toHaveBeenCalledWith(`/rooms/${roomId}`, {
        data: { message: expectedMessage },
      });
      expect(messages.getData()).toEqual([expectedMessage]);
    });

    it('stores and sends private messages', async () => {
      const draft: DraftMessage = {
        content: 'Hello, Recipient!',
        roomId,
        authorId,
        recipientId,
      };

      await dispatcher.send(draft);

      const expectedMessage: SentMessage = {
        id: `message:${now.getTime()}`,
        time: now.getTime(),
        ...draft,
      };
      expect(emitter.emit).toHaveBeenCalledWith(
        `/rooms/${roomId}/private/${recipientId}`,
        { data: { message: expectedMessage } },
      );
      expect(messages.getData()).toEqual([expectedMessage]);
    });
  });
});
