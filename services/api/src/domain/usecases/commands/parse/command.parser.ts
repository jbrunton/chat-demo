import { ContentPolicy, JoinPolicy } from '@entities/rooms/room';
import { BadRequestException } from '@nestjs/common';
import { equals } from 'rambda';
import { z, ZodIssue, ZodType } from 'zod';
import { TokenizedCommand } from '@usecases/commands/tokenize';

export type ParsedCommand =
  | { tag: 'help'; params: null }
  | { tag: 'renameRoom'; params: { newName: string } }
  | { tag: 'renameUser'; params: { newName: string } }
  | { tag: 'inviteUser'; params: { email: string } }
  | { tag: 'approveRequest'; params: { email: string } }
  | { tag: 'leave'; params: null }
  | { tag: 'aboutRoom'; params: null }
  | { tag: 'setRoomJoinPolicy'; params: { newJoinPolicy: JoinPolicy } }
  | { tag: 'setRoomContentPolicy'; params: { newContentPolicy: ContentPolicy } }
  | {
      tag: 'lorem';
      params: { count: number; typeToken: 'words' | 'paragraphs' };
    };

export type ParseResult =
  | {
      match: true;
      command: ParsedCommand;
    }
  | {
      match: false;
    };

export type CommandSchema = ZodType<ParsedCommand, any, any>;

export type CommandParser = (command: TokenizedCommand) => ParseResult;

export type Command = {
  signature: string;
  summary: string;
  parse: CommandParser;
};

type CommandParserParams = {
  matchTokens: string[];
  schema: CommandSchema;
  signature: string;
};

export type CommandParams = CommandParserParams & {
  summary: string;
};

export const buildCommand = ({
  summary,
  signature,
  matchTokens,
  schema,
}: CommandParams): Command => ({
  signature,
  summary,
  parse: commandParser({ signature, matchTokens, schema }),
});

export const commandParser = ({
  matchTokens,
  schema,
  signature,
}: CommandParserParams) => {
  const isMatch = (command: TokenizedCommand): boolean => {
    const actualTokens = command.tokens.slice(0, matchTokens.length);
    return equals(matchTokens, actualTokens);
  };

  const errorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.too_small) {
      return {
        message: `Received too few arguments. Expected: \`${signature}\``,
      };
    } else if (issue.code === z.ZodIssueCode.too_big) {
      return {
        message: `Received too many arguments. Expected: \`${signature}\``,
      };
    }
    return { message: ctx.defaultError };
  };

  return (command: TokenizedCommand): ParseResult => {
    if (!isMatch(command)) {
      return {
        match: false,
      };
    }

    const result = schema.safeParse(command.tokens, {
      errorMap,
    });

    if (result.success) {
      return {
        match: true,
        command: result.data,
      };
    }

    const error = formatError(result.error.errors, command);
    throw new BadRequestException(error);
  };
};

const formatError = (errors: ZodIssue[], command: TokenizedCommand): string => {
  const title = `Error in command \`${command.canonicalInput}\`:`;
  const errorMessages = errors.map((error) => {
    if (error.path.length) {
      const argIndex = error.path[0] as number;
      return `* Argument ${argIndex} (\`${command.tokens[argIndex]}\`): ${error.message}`;
    }
    return `* ${error.message}`;
  });
  return [title, ...errorMessages].join('\n');
};
