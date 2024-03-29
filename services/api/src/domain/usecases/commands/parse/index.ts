import { Command, ParsedCommand } from '@entities/command.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { parsers } from './parsers';

@Injectable()
export class ParseCommandUseCase {
  exec(command: Command): ParsedCommand {
    for (const parser of parsers) {
      const result = parser.parse(command);
      if (result.match) {
        return result.command;
      }
    }

    throw new BadRequestException(unrecognisedResponse(command));
  }
}

const unrecognisedResponse = (command: Command): string => {
  const title = `Unrecognised command \`${command.canonicalInput}\`.`;
  const suggestion = 'Type `/help` for further assistance.';
  return [title, suggestion].join(' ');
};
