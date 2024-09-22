import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/messages';
import { UserFactory } from '@fixtures/messages/user.factory';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { User } from '@entities/users/user';
import { mock, MockProxy } from 'jest-mock-extended';
import { SendMessageUseCase } from '@usecases/messages/send';
import { CommandService } from './command.service';
import { UnauthorizedException } from '@nestjs/common';
import { systemUser } from '@entities/users/system-user';
import { IncomingCommand } from '@entities/commands';

describe('MessagesService', () => {
  let service: MessagesService;

  let send: MockProxy<SendMessageUseCase>;
  let command: MockProxy<CommandService>;

  let authenticatedUser: User;
  let roomId: string;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);

    send = mock<SendMessageUseCase>();
    command = mock<CommandService>();

    service = new MessagesService(send, command);

    authenticatedUser = UserFactory.build();
    roomId = RoomFactory.id();
  });

  describe('handleMessage', () => {
    it('forwards public messages', async () => {
      const message: CreateMessageDto = {
        content: 'Hello!',
        roomId,
      };

      await service.handleMessage(message, authenticatedUser);

      const expectedMessage = {
        content: 'Hello!',
        roomId,
        authorId: authenticatedUser.id,
      };
      expect(send.exec).toHaveBeenCalledWith(
        expectedMessage,
        authenticatedUser,
      );
    });

    it('executes commands', async () => {
      const message: CreateMessageDto = {
        content: '/help',
        roomId,
      };

      await service.handleMessage(message, authenticatedUser);

      const expectedCommand: IncomingCommand = {
        content: '/help',
        roomId,
        authorId: authenticatedUser.id,
      };
      expect(command.exec).toHaveBeenCalledWith(
        expectedCommand,
        authenticatedUser,
      );
    });

    it('forwards expected errors', async () => {
      const error = new UnauthorizedException('You do not have permission');
      command.exec.mockRejectedValue(error);

      const message: CreateMessageDto = {
        content: '/some-command',
        roomId,
      };

      await service.handleMessage(message, authenticatedUser);

      const expectedError = {
        content: 'You do not have permission',
        roomId,
        authorId: 'system',
        recipientId: authenticatedUser.id,
      };
      expect(send.exec).toHaveBeenCalledWith(expectedError, systemUser);
    });

    it('throws unexpected errors', async () => {
      const error = new Error('Something went wrong');
      command.exec.mockRejectedValue(error);

      const message: CreateMessageDto = {
        content: '/some-command',
        roomId,
      };

      await expect(
        service.handleMessage(message, authenticatedUser),
      ).rejects.toEqual(error);
    });
  });
});
