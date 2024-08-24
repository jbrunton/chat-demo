import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';

const schema = z
  .tuple([z.literal('invite'), z.string().email()])
  .transform<ParsedCommand>(([, email]) => ({
    tag: 'inviteUser',
    params: { email },
  }));

export const inviteParser = new CommandParser({
  matchTokens: ['invite'],
  schema,
  signature: `/invite {email}`,
  summary: 'invite a user to the room',
});
