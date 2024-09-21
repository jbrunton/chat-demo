import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';
import { JoinPolicy } from '@entities/rooms/room';

const schema = z
  .tuple([
    z.literal('set'),
    z.literal('room'),
    z.literal('join'),
    z.literal('policy'),
    z.enum([JoinPolicy.Anyone, JoinPolicy.Invite, JoinPolicy.Request]),
  ])
  .rest(z.string())
  .transform<ParsedCommand>(([, , , , joinPolicy]) => ({
    tag: 'setRoomJoinPolicy',
    params: { newJoinPolicy: joinPolicy },
  }));

export const setRoomJoinPolicyParser = new CommandParser({
  matchTokens: ['set', 'room', 'join', 'policy'],
  schema,
  signature: `/set room join policy {'anyone', 'request', 'invite'}`,
  summary: 'set the room join policy',
});
