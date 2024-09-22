import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';

export const loremCommand = buildCommand({
  signature: `/lorem {count} {'words' | 'paragraphs'}`,
  summary: 'generate lorem text',
  matchTokens: ['lorem'],
  schema: z
    .tuple([
      z.literal('lorem'),
      z.coerce.number(),
      z.enum(['words', 'paragraphs']),
    ])
    .transform<ParsedCommand>(([, count, typeToken]) => ({
      tag: 'lorem',
      params: { count, typeToken },
    })),
});
