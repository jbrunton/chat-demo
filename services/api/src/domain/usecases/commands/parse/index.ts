import { BadRequestException, Injectable } from '@nestjs/common';
import { parsers } from './parsers';
import { ParsedCommand } from './command.parser';
import { TokenizedCommand } from '@usecases/commands/tokenize';

@Injectable()
export class ParseCommandUseCase {
  exec(command: TokenizedCommand): ParsedCommand {
    for (const parser of parsers) {
      const result = parser.parse(command);
      if (result.match) {
        return result.command;
      }
    }

    throw new BadRequestException(unrecognisedResponse(command));
  }
}

const unrecognisedResponse = (command: TokenizedCommand): string => {
  const title = `Unrecognised command \`${command.canonicalInput}\`.`;
  const suggestion = 'Type `/help` for further assistance.';
  return [title, suggestion].join(' ');
};
