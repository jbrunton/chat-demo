import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';

const schema = z
  .tuple([z.literal('rename'), z.literal('user'), z.string()])
  .rest(z.string())
  .transform<ParsedCommand>(([, , name, ...rest]) => ({
    tag: 'renameUser',
    params: { newName: [name, ...rest].join(' ') },
  }));

export const renameUserParser = new CommandParser({
  matchTokens: ['rename', 'user'],
  schema,
  signature: '/rename user {name}',
  summary: 'change your display name',
});
