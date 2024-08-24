import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';
import { JoinPolicy } from '@entities/room.entity';

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
    tag: 'changeRoomJoinPolicy',
    params: { newJoinPolicy: joinPolicy },
  }));

export const changeRoomJoinPolicyParser = new CommandParser({
  matchTokens: ['set', 'room', 'join', 'policy'],
  schema,
  signature: `/set room join policy {'anyone', 'request', 'invite'}`,
  summary: 'set the room join policy',
});
