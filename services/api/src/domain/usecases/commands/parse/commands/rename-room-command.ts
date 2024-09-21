import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../command.parser';

const schema = z
  .tuple([z.literal('rename'), z.literal('room'), z.string()])
  .rest(z.string())
  .transform<ParsedCommand>(([, , name, ...rest]) => ({
    tag: 'renameRoom',
    params: { newName: [name, ...rest].join(' ') },
  }));

export const renameRoomCommand = buildCommand({
  matchTokens: ['rename', 'room'],
  schema,
  signature: '/rename room {name}',
  summary: 'change the room name',
});
