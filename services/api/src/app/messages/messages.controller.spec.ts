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
import { UsersRepository } from '@entities/users.repository';
import { MessagesRepository } from '@entities/messages';
import { TestDataModule } from '@fixtures/data/test.data.module';
import { TestUsersRepository } from '@fixtures/data/test.users.repository';
import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { CreateMessageDto } from './dto/create-message.dto';
import { TestMembershipsRepository } from '@fixtures/data/test.memberships.repository';
import { MembershipsRepository } from '@entities/memberships.repository';
import { MembershipStatus } from '@entities/membership.entity';
import { MessagesModule } from './messages.module';
import { Auth0Client } from '@app/auth/auth0/auth0.client';
import { MockLoggerModule } from '@fixtures/MockLoggerModule';

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
