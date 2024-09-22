import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';

export const inviteCommand = buildCommand({
  signature: `/invite {email}`,
  summary: 'invite a user to the room',
  matchTokens: ['invite'],
  schema: z
    .tuple([z.literal('invite'), z.string().email()])
    .transform<ParsedCommand>(([, email]) => ({
      tag: 'inviteUser',
      params: { email },
    })),
});
