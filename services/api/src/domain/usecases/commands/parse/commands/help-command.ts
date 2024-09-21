import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../command.parser';

const schema = z.tuple([z.literal('help')]).transform<ParsedCommand>(() => ({
  tag: 'help',
  params: null,
}));

export const helpCommand = buildCommand({
  matchTokens: ['help'],
  schema,
  signature: '/help',
  summary: 'list commands',
});
