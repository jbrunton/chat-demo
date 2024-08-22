import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';

const schema = z
  .tuple([z.literal('invite'), z.literal('user'), z.string()])
  .transform<ParsedCommand>(([, , email]) => ({
    tag: 'inviteUser',
    params: { email },
  }));

export const changeRoomJoinPolicyParser = new CommandParser({
  matchTokens: ['invite', 'user'],
  schema,
  signature: `/invite user {email}`,
  summary: 'invite a user to the room',
});
