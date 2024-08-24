import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';

const schema = z.tuple([z.literal('leave')]).transform<ParsedCommand>(() => ({
  tag: 'leave',
  params: null,
}));

export const leaveParser = new CommandParser({
  matchTokens: ['leave'],
  schema,
  signature: '/leave',
  summary: 'leave room',
});
