import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { UserFactory } from '@fixtures/messages/user.factory';
import { MessageFactory } from '@fixtures/messages/message.factory';
import { DispatcherService } from './dispatcher.service';
import { MessagesRepository } from '@entities/messages.repository';
import { TestDataModule } from '@fixtures/data/test.data.module';

describe('MessagesService', () => {
  let service: MessagesService;
  let messagesRepository: TestMessagesRepository;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);

    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDataModule],
      providers: [MessagesService, DispatcherService],
    }).compile();

    service = module.get(MessagesService);
    messagesRepository = module.get(MessagesRepository);
  });

  describe('handleMessage', () => {
    it('stores public messages', async () => {
      const roomId = 'Room#1';
      const message: CreateMessageDto = {
        content: 'Hello!',
        roomId,
      };
      const user = UserFactory.build();
      const response = await service.handleMessage(message, user);

      const expectedMessage = {
        id: 'message:1001',
        content: 'Hello!',
        roomId,
        authorId: user.id,
        time: 1001,
      };
      expect(response).toEqual(expectedMessage);
      expect(messagesRepository.getData()).toEqual([expectedMessage]);
    });
  });

  describe('findForRoom', () => {
    it('returns the messages and their authors for the room', async () => {
      const roomId = 'Room#1';
      const msg1 = MessageFactory.build({ roomId });
      const msg2 = MessageFactory.build({ roomId });
      messagesRepository.setData([msg1, msg2]);

      const response = await service.findForRoom(roomId);

      expect(response).toEqual([msg1, msg2]);
    });
  });
});
