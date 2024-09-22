import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';

export const renameUserCommand = buildCommand({
  signature: '/rename user {name}',
  summary: 'change your display name',
  matchTokens: ['rename', 'user'],
  schema: z
    .tuple([z.literal('rename'), z.literal('user'), z.string()])
    .rest(z.string())
    .transform<ParsedCommand>(([, , name, ...rest]) => ({
      tag: 'renameUser',
      params: { newName: [name, ...rest].join(' ') },
    })),
});
