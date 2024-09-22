import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';

export const leaveCommand = buildCommand({
  signature: '/leave',
  summary: 'leave room',
  matchTokens: ['leave'],
  schema: z.tuple([z.literal('leave')]).transform<ParsedCommand>(() => ({
    tag: 'leave',
    params: null,
  })),
});
