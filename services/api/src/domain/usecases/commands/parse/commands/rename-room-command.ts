import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';

export const renameRoomCommand = buildCommand({
  signature: '/rename room {name}',
  summary: 'change the room name',
  matchTokens: ['rename', 'room'],
  schema: z
    .tuple([z.literal('rename'), z.literal('room'), z.string()])
    .rest(z.string())
    .transform<ParsedCommand>(([, , name, ...rest]) => ({
      tag: 'renameRoom',
      params: { newName: [name, ...rest].join(' ') },
    })),
});
