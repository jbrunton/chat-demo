import { IncomingMessage } from '@entities/messages/message';

/**
 * A type representing sent commands.
 * Any message prefixed with a `/` is treated as a command, e.g. `/help`.
 */
export type TokenizedCommand = {
  /**
   * The tokenised command. Tokens are split by whitespace.
   */
  tokens: string[];

  /**
   * The room the command was sent to.
   */
  roomId: string;

  /**
   * A canonical representation of the command. This removes excess whitespace.
   *
   * E.g. `/rename   room   My Room` would be represented as `/rename room My Room`.
   */
  canonicalInput: string;
};

type TokenizedMessage = IncomingMessage | TokenizedCommand;

export const isCommand = (
  message: TokenizedMessage,
): message is TokenizedCommand => {
  return (message as TokenizedCommand).tokens !== undefined;
};
/**
 *
 * @param params Details of the message to parse
 * @returns The parsed message
 */
export const tokenizeMessage = ({
  content,
  roomId,
  authorId,
}: IncomingMessage): TokenizedMessage => {
  if (content.startsWith('/')) {
    const tokens = content
      .slice(1)
      .split(' ')
      .filter((token) => token.length > 0);

    const canonicalInput = `/${tokens.join(' ')}`;

    return {
      roomId,
      tokens,
      canonicalInput,
    };
  }

  return {
    content,
    roomId,
    authorId,
  };
};
