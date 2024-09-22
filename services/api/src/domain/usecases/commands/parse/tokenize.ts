import { IncomingMessage } from '@entities/messages/message';
import { IncomingCommand } from '@entities/commands';

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
 * Tokenizes an incoming command.
 * @param command The command to tokenize
 * @returns The tokenized command
 */
export const tokenizeMessage = ({
  content,
  roomId,
}: IncomingCommand): TokenizedCommand => {
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
};
