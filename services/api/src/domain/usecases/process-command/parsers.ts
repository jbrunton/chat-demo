import { Command } from '@entities/command.entity';
import { User } from '@entities/user.entity';
import { RenameRoomParams } from '@usecases/rooms/rename';
import { RenameUserParams } from '@usecases/users/rename';
import { HelpParams } from './commands/help';
import { LoremParams } from './commands/lorem.command';

export type ParsedCommand =
  | { tag: 'help'; params: HelpParams }
  | { tag: 'renameRoom'; params: RenameRoomParams }
  | { tag: 'renameUser'; params: RenameUserParams }
  | { tag: 'lorem'; params: LoremParams };

export interface CommandParser {
  (command: Command, authenticatedUser: User): ParsedCommand | undefined;
}

export const helpParser: CommandParser = (command, authenticatedUser) => {
  if (command.name === 'help') {
    const params = {
      authenticatedUser,
      roomId: command.roomId,
    };
    return { tag: 'help', params };
  }
};

export const renameRoomParser: CommandParser = (command, authenticatedUser) => {
  if (command.name === 'rename' && command.args[0] === 'room') {
    const params = {
      newName: command.args.slice(1).join(' ').trim(),
      roomId: command.roomId,
      authenticatedUser,
    };
    return { tag: 'renameRoom', params };
  }
};

export const renameUserParser: CommandParser = (command, authenticatedUser) => {
  if (command.name === 'rename' && command.args[0] === 'user') {
    const params = {
      newName: command.args.slice(1).join(' ').trim(),
      roomId: command.roomId,
      authenticatedUser,
    };
    return { tag: 'renameUser', params };
  }
};

export const loremParser: CommandParser = (command, authenticatedUser) => {
  if (command.name === 'lorem') {
    const params = {
      countToken: command.args[0],
      typeToken: command.args[1],
      roomId: command.roomId,
      authenticatedUser,
    };
    return { tag: 'lorem', params };
  }
};

export const parsers: CommandParser[] = [
  helpParser,
  renameRoomParser,
  renameUserParser,
  loremParser,
];
