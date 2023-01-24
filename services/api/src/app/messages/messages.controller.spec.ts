import { CacheModule, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
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
import { DispatcherService } from './dispatcher.service';
import { UsersRepository } from '@entities/users.repository';
import { MessagesRepository } from '@entities/messages.repository';
import { TestDataModule } from '@fixtures/data/test.data.module';
import { TestUsersRepository } from '@fixtures/data/test.users.repository';
import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { IdentifyService } from '@app/auth/identity/identify.service';

jest.mock('@app/auth/auth0/auth0.client');

describe('MessagesController', () => {
  let usersRepository: TestUsersRepository;
  let messagesRepository: TestMessagesRepository;
  let app: INestApplication;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);

    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDataModule, CacheModule.register()],
      controllers: [MessagesController],
      providers: [DispatcherService, MessagesService, IdentifyService],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(FakeAuthGuard)
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
      await request(app.getHttpServer()).get('/messages/Room#1').expect(403, {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('returns messages for the room', async () => {
      const roomId = `room_1`;

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
        .get(`/messages/${roomId}`)
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
    const roomId = 'room_1';

    const message = {
      content: 'Hello!',
      roomId,
    };

    it('requires auth', async () => {
      await request(app.getHttpServer())
        .post('/messages')
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
        id: 'message:1001',
        time: 1001,
        content: message.content,
        authorId: user.id,
        roomId: 'room_1',
      };

      await request(app.getHttpServer())
        .post('/messages')
        .send(message)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201, expectedMessage);

      expect(messagesRepository.getData()).toEqual([expectedMessage]);
      expect(usersRepository.getData()).toEqual([user]);
    });
  });
});
