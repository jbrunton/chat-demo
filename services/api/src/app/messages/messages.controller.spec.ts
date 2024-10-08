import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import {
  FakeAuth0Client,
  FakeAuthGuard,
  fakeAuthUser,
  resetFakeAuthUsers,
} from '@fixtures/auth/FakeAuth';
import { MessageFactory } from '@fixtures/messages/message.factory';
import { UsersRepository } from '@entities/users/users-repository';
import { MessagesRepository } from '@entities/messages/messages-repository';
import { TestUsersRepository } from '@data/repositories/test/test.users.repository';
import { TestMessagesRepository } from '@data/repositories/test/test.messages.repository';
import { Room } from '@entities/rooms/room';
import { RoomsRepository } from '@entities/rooms/rooms-repository';
import { TestRoomsRepository } from '@data/repositories/test/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { CreateMessageDto } from './dto/messages';
import { TestMembershipsRepository } from '@data/repositories/test/test.memberships.repository';
import { MembershipsRepository } from '@entities/memberships/memberships-repository';
import { MembershipStatus } from '@entities/memberships/membership';
import { MessagesModule } from './messages.module';
import { Auth0Client } from '@app/auth/auth0/auth0.client';
import { MockLoggerModule } from '@fixtures/MockLoggerModule';
import { TestDataModule } from '@fixtures/data/test.data.module';

jest.mock('@app/auth/auth0/auth0.client');

describe('MessagesController', () => {
  let usersRepository: TestUsersRepository;
  let messagesRepository: TestMessagesRepository;
  let membershipsRepo: TestMembershipsRepository;
  let app: INestApplication;

  let room: Room;
  let roomId: string;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);

    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDataModule, MessagesModule, MockLoggerModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(FakeAuthGuard)
      .overrideProvider(Auth0Client)
      .useClass(FakeAuth0Client)
      .compile();

    usersRepository = module.get(UsersRepository);
    messagesRepository = module.get(MessagesRepository);
    membershipsRepo = module.get(MembershipsRepository);

    room = RoomFactory.build();
    roomId = room.id;

    const roomsRepository: TestRoomsRepository = module.get(RoomsRepository);
    roomsRepository.setData([room]);

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    resetFakeAuthUsers();
  });

  describe('GET /messages/:roomId', () => {
    it('requires auth', async () => {
      await request(app.getHttpServer())
        .get(`/messages/${roomId}`)
        .expect(403, {
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    it('returns messages for the room', async () => {
      const { accessToken, user } = fakeAuthUser();

      const message = MessageFactory.build({ roomId });

      messagesRepository.setData([message]);
      membershipsRepo.setData([
        {
          userId: user.id,
          from: 1000,
          status: MembershipStatus.Joined,
          roomId,
        },
      ]);

      await request(app.getHttpServer())
        .get(`/messages/${roomId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200, [message]);
    });
  });

  describe('POST /messages', () => {
    let message: CreateMessageDto;

    beforeEach(() => {
      message = {
        content: 'Hello!',
        roomId,
      };
    });

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
      membershipsRepo.setData([
        {
          userId: user.id,
          from: 1000,
          status: MembershipStatus.Joined,
          roomId,
        },
      ]);

      const expectedMessage = {
        id: 'message:1001',
        time: 1001,
        content: message.content,
        authorId: user.id,
        roomId,
      };

      await request(app.getHttpServer())
        .post('/messages')
        .send(message)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(messagesRepository.getData()).toEqual([expectedMessage]);
      expect(usersRepository.getData()).toEqual([user]);
    });
  });
});
