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

/**
 * Returns true if the incoming message is a command.
 * @param message
 */
export const isCommand = (message: IncomingMessage): boolean =>
  message.content.startsWith('/');

/**
 * Tokenizes a command message.
 * @param message The message to tokenize
 * @returns The tokenized command
 */
export const tokenizeMessage = (message: IncomingMessage): TokenizedCommand => {
  if (!isCommand(message)) {
    throw new Error('message must be a command');
  }

  const tokens = message.content
    .slice(1)
    .split(' ')
    .filter((token) => token.length > 0);

  const canonicalInput = `/${tokens.join(' ')}`;

  return {
    roomId: message.roomId,
    tokens,
    canonicalInput,
  };
};
