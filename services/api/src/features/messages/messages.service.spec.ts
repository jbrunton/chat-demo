import { Test, TestingModule } from '@nestjs/testing';
import { MessagesRepository } from './repositories/messages.repository';
import { UsersRepository } from './repositories/users.repository';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserInfo } from '@lib/auth/user-profile/user-info';
import { TestUsersRepository } from '@fixtures/messages/test.users.repository';
import { TestMessagesRepository } from '@fixtures/messages/test.messages.repository';

describe('MessagesService', () => {
  let service: MessagesService;
  let usersRepository: TestUsersRepository;
  let messagesRepository: TestMessagesRepository;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);

    usersRepository = new TestUsersRepository();
    messagesRepository = new TestMessagesRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: UsersRepository, useValue: usersRepository },
        { provide: MessagesRepository, useValue: messagesRepository },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  describe('saveMessage', () => {
    it('stores the message', async () => {
      const message: CreateMessageDto = {
        content: 'Hello!',
        roomId: '1',
      };
      const authorInfo: UserInfo = {
        sub: '1',
        name: 'User 1',
        picture: 'https://example.com/user1.jpg',
      };

      const response = await service.saveMessage(message, authorInfo);

      const expectedMessage = {
        id: 'Msg#1001',
        content: 'Hello!',
        roomId: 'Room#1',
        authorId: 'User#1',
        time: 1001,
      };
      expect(response).toEqual(expectedMessage);
      expect(messagesRepository.getData()).toEqual([expectedMessage]);
      expect(usersRepository.getData()).toEqual([
        {
          id: 'User#1',
          name: 'User 1',
          picture: 'https://example.com/user1.jpg',
        },
      ]);
    });
  });

  describe('findForRoom', () => {
    it('returns the messages and their authors for the room', async () => {
      messagesRepository.setData([
        {
          id: 'Msg#1001#a1',
          content: 'Hello Room 1, from User 1!',
          time: 1001,
          roomId: 'Room#1',
          authorId: 'User#1',
        },
        {
          id: 'Msg#1002#b2',
          content: 'Hello Room 1, from User 2!',
          time: 1002,
          roomId: 'Room#1',
          authorId: 'User#2',
        },
      ]);
      usersRepository.setData([
        {
          id: 'User#1',
          name: 'User 1',
          picture: 'https://example.com/user1.jpg',
        },
        {
          id: 'User#2',
          name: 'User 2',
          picture: 'https://example.com/user2.jpg',
        },
      ]);

      const response = await service.findForRoom('1');

      expect(response).toEqual({
        messages: [
          {
            id: 'Msg#1001#a1',
            content: 'Hello Room 1, from User 1!',
            time: 1001,
            roomId: 'Room#1',
            authorId: 'User#1',
          },
          {
            id: 'Msg#1002#b2',
            content: 'Hello Room 1, from User 2!',
            time: 1002,
            roomId: 'Room#1',
            authorId: 'User#2',
          },
        ],
        authors: {
          'User#1': {
            id: 'User#1',
            name: 'User 1',
            picture: 'https://example.com/user1.jpg',
          },
          'User#2': {
            id: 'User#2',
            name: 'User 2',
            picture: 'https://example.com/user2.jpg',
          },
        },
      });
    });
  });
});
