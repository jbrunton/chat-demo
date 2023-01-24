import { Command } from '@entities/command.entity';
import { User } from '@entities/user.entity';
import { HelpParams } from './commands/help.command';
import { RenameRoomParams } from './commands/rename.room.command';

export type ParsedCommand =
  | { tag: 'help'; params: HelpParams }
  | { tag: 'renameRoom'; params: RenameRoomParams };

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

export const parsers: CommandParser[] = [helpParser, renameRoomParser];
