import { BadRequestException, Injectable } from '@nestjs/common';
import { ParsedCommand } from './parsed-command';
import { TokenizedCommand } from '@usecases/commands/tokenize';
import { commands } from '@usecases/commands/parse/commands';

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
