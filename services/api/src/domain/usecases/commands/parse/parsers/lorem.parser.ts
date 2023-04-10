import { ParsedCommand } from '@entities/command.entity';
import { z } from 'zod';
import { CommandParser } from '../command.parser';

const schema = z
  .tuple([
    z.literal('lorem'),
    z.coerce.number(),
    z.enum(['words', 'paragraphs']),
  ])
  .transform<ParsedCommand>(([, count, typeToken]) => ({
    tag: 'lorem',
    params: { count, typeToken },
  }));

export const loremParser = new CommandParser({
  matchTokens: ['lorem'],
  schema,
  signature: `/lorem {count} {'words' | 'paragraphs'}`,
  summary: 'generate lorem text',
});
