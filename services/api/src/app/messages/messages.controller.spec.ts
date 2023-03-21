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
import { DispatcherService } from './dispatcher.service';
import { UsersRepository } from '@entities/users.repository';
import { MessagesRepository } from '@entities/messages.repository';
import { TestDataModule } from '@fixtures/data/test.data.module';
import { TestUsersRepository } from '@fixtures/data/test.users.repository';
import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { IdentifyService } from '@app/auth/identity/identify.service';
import { CaslAuthService } from '@app/auth/casl.auth.service';
import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { CreateMessageDto } from './dto/create-message.dto';
import { TestMembershipsRepository } from '@fixtures/data/test.memberships.repository';
import { MembershipsRepository } from '@entities/memberships.repository';
import { MembershipStatus } from '@entities/membership.entity';
import { AuthService } from '@entities/auth';
import { ProcessCommandUseCase } from '@usecases/process-command/process';
import { HelpCommandUseCase } from '@usecases/process-command/commands/help';
import { LoremCommandUseCase } from '@usecases/process-command/commands/lorem.command';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { RenameUserUseCase } from '@usecases/users/rename';
import { Dispatcher } from '@entities/message.entity';
import { SendMessageUseCase } from '@usecases/messages/send';
import { GetMessagesUseCase } from '@usecases/messages/get-messages';

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
      imports: [TestDataModule, CacheModule.register()],
      controllers: [MessagesController],
      providers: [
        {
          provide: Dispatcher,
          useClass: DispatcherService,
        },
        MessagesService,
        IdentifyService,
        ProcessCommandUseCase,
        HelpCommandUseCase,
        LoremCommandUseCase,
        RenameRoomUseCase,
        RenameUserUseCase,
        SendMessageUseCase,
        GetMessagesUseCase,
        { provide: AuthService, useClass: CaslAuthService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(FakeAuthGuard)
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
