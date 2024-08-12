import { ParsedCommand } from '@entities/command.entity';
import { z } from 'zod';
import { CommandParser } from '../command.parser';

const schema = z
  .tuple([z.literal('rename'), z.literal('room'), z.string()])
  .rest(z.string())
  .transform<ParsedCommand>(([, , name, ...rest]) => ({
    tag: 'renameRoom',
    params: { newName: [name, ...rest].join(' ') },
  }));

export const renameRoomParser = new CommandParser({
  matchTokens: ['rename', 'room'],
  schema,
  signature: '/rename room {name}',
  summary: 'change the room name',
});
