import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';

export const aboutRoomCommand = buildCommand({
  signature: '/about room',
  summary: 'about room (including policies)',
  matchTokens: ['about', 'room'],
  schema: z
    .tuple([z.literal('about'), z.literal('room')])
    .transform<ParsedCommand>(() => ({
      tag: 'aboutRoom',
      params: null,
    })),
});
