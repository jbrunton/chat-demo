import { Command } from '@entities/command.entity';
import { User } from '@entities/user.entity';
import { HelpResponseParams } from './commands/help.command';

export type ParsedCommand = { tag: 'help'; params: HelpResponseParams };

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

export const parsers: CommandParser[] = [helpParser];
