import { Command, ParsedCommand } from '@entities/command.entity';
import { BadRequestException } from '@nestjs/common';
import { equals } from 'rambda';
import { z, ZodIssue, ZodType } from 'zod';

export type ParseResult =
  | {
      match: true;
      command: ParsedCommand;
    }
  | {
      match: false;
    };

export type CommandSchema = ZodType<ParsedCommand, any, any>;

export type CommandParserParams = {
  matchTokens: string[];
  schema: CommandSchema;
  signature: string;
  summary: string;
};
export class CommandParser {
  private readonly matchTokens: string[];
  private readonly schema: CommandSchema;
  readonly signature: string;
  readonly summary: string;

  constructor({
    matchTokens,
    schema,
    signature,
    summary,
  }: CommandParserParams) {
    this.matchTokens = matchTokens;
    this.schema = schema;
    this.signature = signature;
    this.summary = summary;
  }

  parse(command: Command): ParseResult {
    if (!this.isMatch(command)) {
      return {
        match: false,
      };
    }

    const result = this.schema.safeParse(command.tokens, {
      errorMap: this.errorMap,
    });

    if (result.success) {
      return {
        match: true,
        command: result.data,
      };
    }

    const error = formatError(result.error.errors, command);
    throw new BadRequestException(error);
  }

  private isMatch(command: Command): boolean {
    const expectedTokens = this.matchTokens;
    const actualTokens = command.tokens.slice(0, this.matchTokens.length);
    return equals(expectedTokens, actualTokens);
  }

  private errorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.too_small) {
      return {
        message: `Received too few arguments. Expected: \`${this.signature}\``,
      };
    } else if (issue.code === z.ZodIssueCode.too_big) {
      return {
        message: `Received too many arguments. Expected: \`${this.signature}\``,
      };
    }
    return { message: ctx.defaultError };
  };
}

const formatError = (errors: ZodIssue[], command: Command): string => {
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
