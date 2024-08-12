/**
 * A type representing sent commands.
 * Any message prefixed with a `/` is treated as a command, e.g. `/help`.
 */
export type Command = {
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
