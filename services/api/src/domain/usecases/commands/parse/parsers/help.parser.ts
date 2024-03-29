import { ParsedCommand } from '@entities/command.entity';
import { z } from 'zod';
import { CommandParser } from '../command.parser';

const schema = z.tuple([z.literal('help')]).transform<ParsedCommand>(() => ({
  tag: 'help',
  params: null,
}));

export const helpParser = new CommandParser({
  matchTokens: ['help'],
  schema,
  signature: '/help',
  summary: 'list commands',
});
