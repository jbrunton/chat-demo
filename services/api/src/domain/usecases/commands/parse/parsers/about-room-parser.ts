import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';

const schema = z
  .tuple([z.literal('about'), z.literal('room')])
  .transform<ParsedCommand>(() => ({
    tag: 'aboutRoom',
    params: null,
  }));

export const aboutRoomParser = new CommandParser({
  matchTokens: ['about', 'room'],
  schema,
  signature: '/about room',
  summary: 'about room (including policies)',
});
