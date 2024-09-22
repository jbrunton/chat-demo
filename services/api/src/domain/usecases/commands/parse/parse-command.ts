import { BadRequestException, Injectable } from '@nestjs/common';
import { ParsedCommand } from './parsed-command';
import {
  TokenizedCommand,
  tokenizeMessage,
} from '@usecases/commands/parse/tokenize';
import { commands } from '@usecases/commands/parse/commands';
import { IncomingCommand } from '@entities/commands';

@Injectable()
export class ParseCommandUseCase {
  exec(command: IncomingCommand): ParsedCommand {
    const tokenizedCommand = tokenizeMessage(command);

    for (const command of commands) {
      const result = command.parse(tokenizedCommand);
      if (result.match) {
        return result.command;
      }
    }

    throw new BadRequestException(unrecognisedResponse(tokenizedCommand));
  }
}

const unrecognisedResponse = (command: TokenizedCommand): string => {
  const title = `Unrecognised command \`${command.canonicalInput}\`.`;
  const suggestion = 'Type `/help` for further assistance.';
  return [title, suggestion].join(' ');
};
