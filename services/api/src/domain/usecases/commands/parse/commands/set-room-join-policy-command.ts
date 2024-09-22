import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';
import { JoinPolicy } from '@entities/rooms/room';

export const setRoomJoinPolicyCommand = buildCommand({
  signature: `/set room join policy {'anyone', 'request', 'invite'}`,
  summary: 'set the room join policy',
  matchTokens: ['set', 'room', 'join', 'policy'],
  schema: z
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
    })),
});
