import { Command } from '@entities/command.entity';
import { BadRequestException } from '@nestjs/common';
import { ParseCommandUseCase } from '.';
import { ParsedCommand } from './command.parser';

describe('ParseCommandUseCase', () => {
  let parse: ParseCommandUseCase;

  beforeEach(() => {
    parse = new ParseCommandUseCase();
  });

  const withMessage = (command: string) => {
    const tokens = command.slice(1).split(' ');
    const parsedCommand: Command = {
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

  it('responds if the command is unrecognised', () => {
    const command: Command = {
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