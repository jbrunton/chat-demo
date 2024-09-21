import { BadRequestException } from '@nestjs/common';
import { ParseCommandUseCase } from '.';
import { ParsedCommand } from './command.parser';
import { ContentPolicy, JoinPolicy } from '@entities/rooms/room';
import { TokenizedCommand } from '@usecases/commands/tokenize';

describe('ParseCommandUseCase', () => {
  let parse: ParseCommandUseCase;

  beforeEach(() => {
    parse = new ParseCommandUseCase();
  });

  const withMessage = (command: string) => {
    const tokens = command.slice(1).split(' ');
    const parsedCommand: TokenizedCommand = {
      roomId: 'my-room',
      tokens,
      canonicalInput: `/${tokens.join(' ')}`,
    };
    const parse = new ParseCommandUseCase();
    return {
      expectCommand: (expected: ParsedCommand) => {
        const result = parse.exec(parsedCommand);
        expect(result).toEqual(expected);
      },

      expectError: (...expectedMessage: string[]) => {
        expect(() => parse.exec(parsedCommand)).toThrow(
          new BadRequestException(expectedMessage.join('\n')),
        );
      },
    };
  };

  describe('/help', () => {
    it('parses the command', () => {
      withMessage('/help').expectCommand({
        tag: 'help',
        params: null,
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/help me').expectError(
        'Error in command `/help me`:',
        '* Received too many arguments. Expected: `/help`',
      );
    });
  });

  describe('/lorem', () => {
    it('parses valid commands', () => {
      withMessage('/lorem 3 words').expectCommand({
        tag: 'lorem',
        params: {
          count: 3,
          typeToken: 'words',
        },
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/lorem').expectError(
        'Error in command `/lorem`:',
        `* Received too few arguments. Expected: \`/lorem {count} {'words' | 'paragraphs'}\``,
      );
      withMessage('/lorem 3 words paragraphs').expectError(
        'Error in command `/lorem 3 words paragraphs`:',
        `* Received too many arguments. Expected: \`/lorem {count} {'words' | 'paragraphs'}\``,
      );
    });

    it('validates the arguments', () => {
      withMessage('/lorem three words').expectError(
        'Error in command `/lorem three words`:',
        '* Argument 1 (`three`): Expected number, received nan',
      );
      withMessage('/lorem 3 chars').expectError(
        'Error in command `/lorem 3 chars`:',
        `* Argument 2 (\`chars\`): Invalid enum value. Expected 'words' | 'paragraphs', received 'chars'`,
      );
    });
  });

  describe('/rename room', () => {
    it('parses valid commands', () => {
      withMessage('/rename room My Room').expectCommand({
        tag: 'renameRoom',
        params: {
          newName: 'My Room',
        },
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/rename room').expectError(
        'Error in command `/rename room`:',
        `* Received too few arguments. Expected: \`/rename room {name}\``,
      );
    });
  });

  describe('/rename user', () => {
    it('parses valid commands', () => {
      withMessage('/rename user My User').expectCommand({
        tag: 'renameUser',
        params: {
          newName: 'My User',
        },
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/rename user').expectError(
        'Error in command `/rename user`:',
        `* Received too few arguments. Expected: \`/rename user {name}\``,
      );
    });
  });

  describe('/rename user', () => {
    it('parses valid commands', () => {
      withMessage('/rename user My User').expectCommand({
        tag: 'renameUser',
        params: {
          newName: 'My User',
        },
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/rename user').expectError(
        'Error in command `/rename user`:',
        `* Received too few arguments. Expected: \`/rename user {name}\``,
      );
    });
  });

  describe('/leave', () => {
    it('parses valid commands', () => {
      withMessage('/leave').expectCommand({
        tag: 'leave',
        params: null,
      });
    });
  });

  describe('/set room join policy', () => {
    it('parses valid commands', () => {
      withMessage('/set room join policy anyone').expectCommand({
        tag: 'setRoomJoinPolicy',
        params: {
          newJoinPolicy: JoinPolicy.Anyone,
        },
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/set room join policy').expectError(
        'Error in command `/set room join policy`:',
        `* Received too few arguments. Expected: \`/set room join policy {'anyone', 'request', 'invite'}\``,
      );
    });
  });

  describe('/set room content policy', () => {
    it('parses valid commands', () => {
      withMessage('/set room content policy public').expectCommand({
        tag: 'setRoomContentPolicy',
        params: {
          newContentPolicy: ContentPolicy.Public,
        },
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/set room content policy').expectError(
        'Error in command `/set room content policy`:',
        `* Received too few arguments. Expected: \`/set room content policy {'public', 'private'}\``,
      );
    });
  });

  describe('/invite', () => {
    it('parses valid commands', () => {
      withMessage('/invite joe.bloggs@example.com').expectCommand({
        tag: 'inviteUser',
        params: {
          email: 'joe.bloggs@example.com',
        },
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/invite').expectError(
        'Error in command `/invite`:',
        `* Received too few arguments. Expected: \`/invite {email}\``,
      );
    });

    it('validates the email', () => {
      withMessage('/invite not-an-email').expectError(
        'Error in command `/invite not-an-email`:',
        `* Argument 1 (\`not-an-email\`): Invalid email`,
      );
    });
  });

  describe('/approve request', () => {
    it('parses valid commands', () => {
      withMessage('/approve request joe.bloggs@example.com').expectCommand({
        tag: 'approveRequest',
        params: {
          email: 'joe.bloggs@example.com',
        },
      });
    });

    it('validates the number of arguments', () => {
      withMessage('/approve request').expectError(
        'Error in command `/approve request`:',
        `* Received too few arguments. Expected: \`/approve request {email}\``,
      );
    });

    it('validates the email', () => {
      withMessage('/approve request not-an-email').expectError(
        'Error in command `/approve request not-an-email`:',
        `* Argument 2 (\`not-an-email\`): Invalid email`,
      );
    });
  });

  it('responds if the command is unrecognised', () => {
    const command: TokenizedCommand = {
      roomId: 'my-room',
      tokens: ['not', 'a', 'command'],
      canonicalInput: '/not a command',
    };
    expect(() => parse.exec(command)).toThrow(
      new BadRequestException(
        'Unrecognised command `/not a command`. Type `/help` for further assistance.',
      ),
    );
  });
});
