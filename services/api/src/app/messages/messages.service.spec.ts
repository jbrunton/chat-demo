import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { TestUsersRepository } from '@fixtures/messages/test.users.repository';
import { TestMessagesRepository } from '@fixtures/messages/test.messages.repository';
import { UserFactory } from '@fixtures/messages/user.factory';
import { MessageFactory } from '@fixtures/messages/message.factory';
import { DispatcherService } from './dispatcher.service';
import { AuthInfoFactory } from '@fixtures/auth/auth-info.factory';
import { UsersRepository } from '@entities/users.repository';
import { MessagesRepository } from '@entities/messages.repository';

describe('MessagesService', () => {
  let service: MessagesService;
  let usersRepository: TestUsersRepository;
  let messagesRepository: TestMessagesRepository;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        DispatcherService,
        TestUsersRepository.Provider,
        TestMessagesRepository.Provider,
      ],
    }).compile();

    service = module.get(MessagesService);
    usersRepository = module.get(UsersRepository);
    messagesRepository = module.get(MessagesRepository);
  });

  describe('handleMessage', () => {
    it('stores public messages', async () => {
      const roomId = 'Room#1';
      const message: CreateMessageDto = {
        content: 'Hello!',
        roomId,
      };
      const author = AuthInfoFactory.build();
      const response = await service.handleMessage(message, author);

      const expectedMessage = {
        id: 'message:1001',
        content: 'Hello!',
        roomId,
        authorId: `user:${author.sub}`,
        time: 1001,
      };
      expect(response).toEqual(expectedMessage);
      expect(messagesRepository.getData()).toEqual([expectedMessage]);
      expect(usersRepository.getData()).toEqual([
        {
          id: `user:${author.sub}`,
          name: author.name,
          picture: author.picture,
        },
      ]);
    });
  });

  describe('findForRoom', () => {
    it('returns the messages and their authors for the room', async () => {
      const roomId = 'Room#1';
      const author1 = UserFactory.build();
      const author2 = UserFactory.build();
      const msg1 = MessageFactory.build({
        authorId: author1.id,
        roomId,
      });
      const msg2 = MessageFactory.build({
        authorId: author2.id,
        roomId,
      });

      usersRepository.setData([author1, author2]);
      messagesRepository.setData([msg1, msg2]);

      const response = await service.findForRoom(roomId);

      expect(response).toEqual({
        messages: [msg1, msg2],
        authors: {
          [author1.id]: author1,
          [author2.id]: author2,
        },
      });
    });
  });
});
