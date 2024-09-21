import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../command.parser';

const schema = z.tuple([z.literal('leave')]).transform<ParsedCommand>(() => ({
  tag: 'leave',
  params: null,
}));

export const leaveCommand = buildCommand({
  matchTokens: ['leave'],
  schema,
  signature: '/leave',
  summary: 'leave room',
});
