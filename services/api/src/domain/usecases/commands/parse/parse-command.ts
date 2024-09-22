import { BadRequestException, Injectable } from '@nestjs/common';
import { commands } from './commands/command-parsers';
import { ParsedCommand } from './parsed-command';
import { TokenizedCommand } from '@usecases/commands/tokenize';

@Injectable()
export class ParseCommandUseCase {
  exec(tokenizedCommand: TokenizedCommand): ParsedCommand {
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
