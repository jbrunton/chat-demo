import {
  buildCommand,
  Command,
  ParsedCommand,
} from '@usecases/commands/parse/parsed-command';
import { z } from 'zod';
import { ContentPolicy, JoinPolicy } from '@entities/rooms/room';

const aboutRoomCommand = buildCommand({
  signature: '/about room',
  summary: 'about room (including policies)',
  matchTokens: ['about', 'room'],
  schema: z
    .tuple([z.literal('about'), z.literal('room')])
    .transform<ParsedCommand>(() => ({
      tag: 'aboutRoom',
      params: null,
    })),
});

const approveRequestCommand = buildCommand({
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

const helpCommand = buildCommand({
  signature: '/help',
  summary: 'list commands',
  matchTokens: ['help'],
  schema: z.tuple([z.literal('help')]).transform<ParsedCommand>(() => ({
    tag: 'help',
    params: null,
  })),
});

const inviteCommand = buildCommand({
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

const leaveCommand = buildCommand({
  signature: '/leave',
  summary: 'leave room',
  matchTokens: ['leave'],
  schema: z.tuple([z.literal('leave')]).transform<ParsedCommand>(() => ({
    tag: 'leave',
    params: null,
  })),
});

const loremCommand = buildCommand({
  signature: `/lorem {count} {'words' | 'paragraphs'}`,
  summary: 'generate lorem text',
  matchTokens: ['lorem'],
  schema: z
    .tuple([
      z.literal('lorem'),
      z.coerce.number(),
      z.enum(['words', 'paragraphs']),
    ])
    .transform<ParsedCommand>(([, count, typeToken]) => ({
      tag: 'lorem',
      params: { count, typeToken },
    })),
});

const renameRoomCommand = buildCommand({
  signature: '/rename room {name}',
  summary: 'change the room name',
  matchTokens: ['rename', 'room'],
  schema: z
    .tuple([z.literal('rename'), z.literal('room'), z.string()])
    .rest(z.string())
    .transform<ParsedCommand>(([, , name, ...rest]) => ({
      tag: 'renameRoom',
      params: { newName: [name, ...rest].join(' ') },
    })),
});

const renameUserCommand = buildCommand({
  signature: '/rename user {name}',
  summary: 'change your display name',
  matchTokens: ['rename', 'user'],
  schema: z
    .tuple([z.literal('rename'), z.literal('user'), z.string()])
    .rest(z.string())
    .transform<ParsedCommand>(([, , name, ...rest]) => ({
      tag: 'renameUser',
      params: { newName: [name, ...rest].join(' ') },
    })),
});

const setRoomContentPolicyCommand = buildCommand({
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

const setRoomJoinPolicyCommand = buildCommand({
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

export const commands: Command[] = [
  helpCommand,
  loremCommand,
  renameRoomCommand,
  renameUserCommand,
  leaveCommand,
  setRoomJoinPolicyCommand,
  setRoomContentPolicyCommand,
  aboutRoomCommand,
  inviteCommand,
  approveRequestCommand,
];
