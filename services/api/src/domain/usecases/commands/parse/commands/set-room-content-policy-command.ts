import { z } from 'zod';
import { buildCommand, CommandParser, ParsedCommand } from '../parsed-command';
import { ContentPolicy } from '@entities/rooms/room';

export const setRoomContentPolicyCommand = buildCommand({
  signature: `/set room content policy {'public', 'private'}`,
  summary: 'set the room content policy',
  matchTokens: ['set', 'room', 'content', 'policy'],
  schema: z
    .tuple([
      z.literal('set'),
      z.literal('room'),
      z.literal('content'),
      z.literal('policy'),
      z.enum([ContentPolicy.Private, ContentPolicy.Public]),
    ])
    .rest(z.string())
    .transform<ParsedCommand>(([, , , , contentPolicy]) => ({
      tag: 'setRoomContentPolicy',
      params: { newContentPolicy: contentPolicy },
    })),
});
