import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../command.parser';

const schema = z
  .tuple([z.literal('invite'), z.string().email()])
  .transform<ParsedCommand>(([, email]) => ({
    tag: 'inviteUser',
    params: { email },
  }));

export const inviteCommand = buildCommand({
  matchTokens: ['invite'],
  schema,
  signature: `/invite {email}`,
  summary: 'invite a user to the room',
});
