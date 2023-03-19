import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { TestMessagesRepository } from '@fixtures/data/test.messages.repository';
import { UserFactory } from '@fixtures/messages/user.factory';
import { MessageFactory } from '@fixtures/messages/message.factory';
import { DispatcherService } from './dispatcher.service';
import { MessagesRepository } from '@entities/messages.repository';
import { TestDataModule } from '@fixtures/data/test.data.module';
import { CaslAuthService } from '@app/auth/casl.auth.service';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { Room } from '@entities/room.entity';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { User } from '@entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@entities/auth';
import { ProcessCommandUseCase } from '@usecases/process-command/process';
import { HelpCommandUseCase } from '@usecases/process-command/commands/help';
import { LoremCommandUseCase } from '@usecases/process-command/commands/lorem.command';
import { RenameUserUseCase } from '@usecases/users/rename';
import { RenameRoomUseCase } from '@usecases/rooms/rename';
import { mock, MockProxy } from 'jest-mock-extended';
import { Dispatcher } from '@entities/message.entity';

describe('MessagesService', () => {
  let service: MessagesService;
  let messagesRepository: TestMessagesRepository;
  let roomsRepo: TestRoomsRepository;
  let dispatcher: MockProxy<DispatcherService>;

  let room: Room;
  let user: User;
  let roomId: string;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);

    dispatcher = mock<DispatcherService>();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDataModule],
      providers: [
        MessagesService,
        ProcessCommandUseCase,
        HelpCommandUseCase,
        LoremCommandUseCase,
        RenameUserUseCase,
        RenameRoomUseCase,
        { provide: AuthService, useClass: CaslAuthService },
        { provide: Dispatcher, useValue: dispatcher },
      ],
    }).compile();

    service = module.get(MessagesService);
    messagesRepository = module.get(MessagesRepository);
    roomsRepo = module.get(RoomsRepository);

    user = UserFactory.build();
    room = RoomFactory.build({ ownerId: user.id });
    roomId = room.id;
    roomsRepo.setData([room]);
  });

  describe('handleMessage', () => {
    it('stores public messages', async () => {
      const message: CreateMessageDto = {
        content: 'Hello!',
        roomId,
      };

      await service.handleMessage(message, user);

      const expectedMessage = {
        id: 'message:1001',
        content: 'Hello!',
        roomId,
        authorId: user.id,
        time: 1001,
      };
      expect(dispatcher.emit).toHaveBeenCalledWith(expectedMessage);
      expect(messagesRepository.getData()).toEqual([expectedMessage]);
    });

    it('returns error messages', async () => {
      const user = UserFactory.build();
      const message: CreateMessageDto = {
        content: 'Hello!',
        roomId,
      };

      await service.handleMessage(message, user);

      const expectedMessage = {
        id: 'message:1001',
        content: 'You do not have permission to post to this room',
        roomId,
        authorId: 'system',
        time: 1001,
        recipientId: user.id,
      };
      expect(dispatcher.emit).toHaveBeenCalledWith(expectedMessage);
      expect(messagesRepository.getData()).toEqual([expectedMessage]);
    });
  });

  describe('findForRoom', () => {
    it('returns the messages and their authors for the room', async () => {
      const roomId = room.id;
      const msg1 = MessageFactory.build({ roomId });
      const msg2 = MessageFactory.build({ roomId });
      messagesRepository.setData([msg1, msg2]);

      const response = await service.findForRoom(roomId, user);

      expect(response).toEqual([msg1, msg2]);
    });

    it('authorizes access to messages', async () => {
      const roomId = room.id;
      const otherUser = UserFactory.build();

      await expect(service.findForRoom(roomId, otherUser)).rejects.toEqual(
        new UnauthorizedException(
          'You do not have permission to perform this action.',
        ),
      );
    });
  });
});
