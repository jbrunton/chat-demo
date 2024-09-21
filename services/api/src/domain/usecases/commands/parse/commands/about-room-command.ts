import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../command.parser';

const schema = z
  .tuple([z.literal('about'), z.literal('room')])
  .transform<ParsedCommand>(() => ({
    tag: 'aboutRoom',
    params: null,
  }));

export const aboutRoomCommand = buildCommand({
  matchTokens: ['about', 'room'],
  schema,
  signature: '/about room',
  summary: 'about room (including policies)',
});
