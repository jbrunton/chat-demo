import { IncomingMessage } from '@entities/messages/message';

/**
 * An incoming message which is a command. Any message with content prefixed by a forward slash is
 * considered a command, where or not it can be parsed. If it cannot be parsed, it is an invalid
 * command.
 */
export type IncomingCommand = IncomingMessage & {
  content: `/${string}`;
};

export const isCommand = (
  message: IncomingMessage,
): message is IncomingCommand => message.content.startsWith('/');
