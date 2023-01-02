import { TestMessagesRepository } from '@fixtures/messages/test.messages.repository';
import { TestUsersRepository } from '@fixtures/messages/test.users.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesRepository } from './repositories/messages.repository';
import { UsersRepository } from './repositories/users.repository';
import * as request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import {
  FakeAuthGuard,
  fakeAuthUser,
  resetFakeAuthUsers,
} from '@fixtures/auth/FakeAuth';
import { MessagesService } from './messages.service';
import { MessageFactory } from '@fixtures/messages/message.factory';
import { UserFactory } from '@fixtures/messages/user.factory';

jest.mock('@lib/auth/auth0/auth0.client');

describe('MessagesController', () => {
  let usersRepository: TestUsersRepository;
  let messagesRepository: TestMessagesRepository;
  let app: INestApplication;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MessagesController],
      providers: [
        MessagesController,
        MessagesService,
        TestUsersRepository.Provider,
        TestMessagesRepository.Provider,
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(FakeAuthGuard)
      .compile();

    usersRepository = module.get(UsersRepository);
    messagesRepository = module.get(MessagesRepository);

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    resetFakeAuthUsers();
  });

  describe('GET /messages/:roomId', () => {
    it('requires auth', async () => {
      await request(app.getHttpServer()).get('/messages/1').expect(403, {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('returns messages for the room', async () => {
      const roomSuffix = '101';
      const roomId = `Room#${roomSuffix}`;

      const { accessToken } = fakeAuthUser();

      const author = UserFactory.build();
      const message = MessageFactory.build({
        authorId: author.id,
        roomId,
        time: 1001,
      });

      messagesRepository.setData([message]);
      usersRepository.setData([author]);

      await request(app.getHttpServer())
        .get(`/messages/${roomSuffix}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200, {
          messages: [message],
          authors: {
            [author.id]: author,
          },
        });
    });
  });

  describe('POST /messages', () => {
    const roomId = '1';

    const message = {
      content: 'Hello!',
    };

    it('requires auth', async () => {
      await request(app.getHttpServer())
        .post(`/messages/${roomId}`)
        .send(message)
        .expect(403, {
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    it('stores the posted message and its author', async () => {
      const { accessToken, user } = fakeAuthUser();

      const expectedMessage = {
        id: 'Msg#1001',
        content: message.content,
        time: 1001,
        authorId: user.id,
        roomId: 'Room#1',
      };

      await request(app.getHttpServer())
        .post(`/messages/${roomId}`)
        .send(message)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201, expectedMessage);

      expect(messagesRepository.getData()).toEqual([expectedMessage]);
      expect(usersRepository.getData()).toEqual([user]);
    });
  });
});