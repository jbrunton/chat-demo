import { Command } from '@entities/command.entity';
import { DraftMessage } from '@entities/messages';

export type ParsedMessage = DraftMessage | Command;

export const isCommand = (message: ParsedMessage): message is Command => {
  return (message as Command).tokens !== undefined;
};

export type ParseMessageParams = {
  content: string;
  roomId: string;
  authorId: string;
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
}: ParseMessageParams): ParsedMessage => {
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
