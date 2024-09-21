import { Command } from '@entities/command';
import { DraftMessage, IncomingMessage } from '@entities/messages/message';

export type ParsedMessage = DraftMessage | Command;

export const isCommand = (message: ParsedMessage): message is Command => {
  return (message as Command).tokens !== undefined;
};

/**
 *
 * @param params Details of the message to parse
 * @returns The parsed message
 */
export const parseMessage = ({
  content,
  roomId,
  authorId,
}: IncomingMessage): ParsedMessage => {
  if (content.startsWith('/')) {
    const tokens = content
      .slice(1)
      .split(' ')
      .filter((token) => token.length > 0);

    const canonicalInput = `/${tokens.join(' ')}`;

    const command: Command = {
      roomId,
      tokens,
      canonicalInput,
    };

    return command;
  }

  const message: ParsedMessage = {
    content,
    roomId,
    authorId,
  };

  return message;
};
