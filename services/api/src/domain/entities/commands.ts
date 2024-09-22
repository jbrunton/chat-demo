import { IncomingMessage } from '@entities/messages/message';

export type IncomingCommand = IncomingMessage & {
  content: `/${string}`;
};

export const isCommand = (
  message: IncomingMessage,
): message is IncomingCommand => message.content.startsWith('/');
