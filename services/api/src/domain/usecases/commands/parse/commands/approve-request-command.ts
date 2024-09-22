import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';

export const approveRequestCommand = buildCommand({
  signature: `/approve request {email}`,
  summary: 'approve pending request to join the room',
  matchTokens: ['approve', 'request'],
  schema: z
    .tuple([z.literal('approve'), z.literal('request'), z.string().email()])
    .transform<ParsedCommand>(([, , email]) => ({
      tag: 'approveRequest',
      params: { email },
    })),
});
