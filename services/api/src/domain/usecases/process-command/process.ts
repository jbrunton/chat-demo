import { Command } from '@entities/command.entity';
import { Draft, PrivateMessage } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { helpResponse } from './commands/help.command';
import { ParsedCommand, parsers } from './parsers';

export const processCommand = (
  command: Command,
  user: User,
): Draft<PrivateMessage> => {
  for (const parser of parsers) {
    const parsedCommand = parser(command, user);
    if (parsedCommand) {
      return executeCommand(parsedCommand);
    }
  }

  return {
    content: unrecognisedResponse,
    recipientId: user.id,
    roomId: command.roomId,
    authorId: 'system',
  };
};

export const executeCommand = ({
  tag,
  params,
}: ParsedCommand): Draft<PrivateMessage> => {
  switch (tag) {
    case 'help':
      return helpResponse(params);
  }
};

const unrecognisedResponse =
  'Unrecognised command, type <b>/help</b> for further assistance';
