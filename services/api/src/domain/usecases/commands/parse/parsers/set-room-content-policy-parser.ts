import { z } from 'zod';
import { CommandParser, ParsedCommand } from '../command.parser';
import { ContentPolicy } from '@entities/rooms/room';

const schema = z
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
  }));

export const setRoomContentPolicyParser = new CommandParser({
  matchTokens: ['set', 'room', 'content', 'policy'],
  schema,
  signature: `/set room content policy {'public', 'private'}`,
  summary: 'set the room content policy',
});
