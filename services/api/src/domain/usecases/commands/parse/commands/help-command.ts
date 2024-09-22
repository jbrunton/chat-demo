import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';

export const helpCommand = buildCommand({
  signature: '/help',
  summary: 'list commands',
  matchTokens: ['help'],
  schema: z.tuple([z.literal('help')]).transform<ParsedCommand>(() => ({
    tag: 'help',
    params: null,
  })),
});
