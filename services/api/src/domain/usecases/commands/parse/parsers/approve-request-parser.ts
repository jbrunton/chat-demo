import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';

const schema = z
  .tuple([z.literal('approve'), z.literal('request'), z.string().email()])
  .transform<ParsedCommand>(([, , email]) => ({
    tag: 'approveRequest',
    params: { email },
  }));

export const approveRequestParser = new CommandParser({
  matchTokens: ['approve', 'request'],
  schema,
  signature: `/approve request {email}`,
  summary: 'approve pending request to join the room',
});
