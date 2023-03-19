import { AuthService } from '@entities/auth';
import { Command } from '@entities/command.entity';
import { DraftMessage } from '@entities/message.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { UsersRepository } from '@entities/users.repository';
import { helpResponse } from './commands/help.command';
import { loremResponse } from './commands/lorem.command';
import { renameRoom } from './commands/rename-room.command';
import { renameUser } from './commands/rename-user.command';
import { ParsedCommand, parsers } from './parsers';

export const processCommand = async (
  command: Command,
  user: User,
  roomsRepo: RoomsRepository,
  usersRepo: UsersRepository,
  authService: AuthService,
): Promise<DraftMessage> => {
  for (const parser of parsers) {
    const parsedCommand = parser(command, user);
    if (parsedCommand) {
      return await executeCommand(
        parsedCommand,
        roomsRepo,
        usersRepo,
        authService,
      );
    }
  }

  return {
    roomId: command.roomId,
    content: unrecognisedResponse,
    authorId: 'system',
    recipientId: user.id,
  };
};

export const executeCommand = async (
  { tag, params }: ParsedCommand,
  roomsRepo: RoomsRepository,
  usersRepo: UsersRepository,
  authService: AuthService,
): Promise<DraftMessage> => {
  switch (tag) {
    case 'help':
      return helpResponse(params);
    case 'renameRoom':
      return renameRoom(params, roomsRepo, authService);
    case 'renameUser':
      return renameUser(params, usersRepo);
    case 'lorem':
      return loremResponse(params);
  }
};

const unrecognisedResponse =
  'Unrecognised command, type <b>/help</b> for further assistance';
