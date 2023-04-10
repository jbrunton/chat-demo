import { Command, ParsedCommand } from '@entities/command.entity';
import { BadRequestException } from '@nestjs/common';
import { ParseCommandUseCase } from './parse';

describe('ParseCommandUseCase', () => {
  let parse: ParseCommandUseCase;

  beforeEach(() => {
    parse = new ParseCommandUseCase();
  });

  const expectCommand = (command: string) => {
    const tokens = command.slice(1).split(' ');
    const parsedCommand: Command = {
      roomId: 'my-room',
      tokens,
      canonicalInput: `/${tokens.join(' ')}`,
    };
    const parse = new ParseCommandUseCase();
    return {
      toReturn: (expected: ParsedCommand) => {
        const result = parse.exec(parsedCommand);
        expect(result).toEqual(expected);
      },

      toErrorWith: (...expectedMessage: string[]) => {
        expect(() => parse.exec(parsedCommand)).toThrow(
          new BadRequestException(expectedMessage.join('\n')),
        );
      },
    };
  };

  describe('/help', () => {
    it('parses the command', () => {
      expectCommand('/help').toReturn({
        tag: 'help',
        params: null,
      });
    });

    it('validates the number of arguments', () => {
      expectCommand('/help me').toErrorWith(
        'Error in command `/help me`:',
        '* Received too many arguments. Expected: `/help`',
      );
    });
  });

  describe('/lorem', () => {
    it('parses valid commands', () => {
      expectCommand('/lorem 3 words').toReturn({
        tag: 'lorem',
        params: {
          count: 3,
          typeToken: 'words',
        },
      });
    });

    it('validates the number of arguments', () => {
      expectCommand('/lorem').toErrorWith(
        'Error in command `/lorem`:',
        `* Received too few arguments. Expected: \`/lorem {count} {'words' | 'paragraphs'}\``,
      );
      expectCommand('/lorem 3 words paragraphs').toErrorWith(
        'Error in command `/lorem 3 words paragraphs`:',
        `* Received too many arguments. Expected: \`/lorem {count} {'words' | 'paragraphs'}\``,
      );
    });

    it('validates the arguments', () => {
      expectCommand('/lorem three words').toErrorWith(
        'Error in command `/lorem three words`:',
        '* Argument 1 (`three`): Expected number, received nan',
      );
      expectCommand('/lorem 3 chars').toErrorWith(
        'Error in command `/lorem 3 chars`:',
        `* Argument 2 (\`chars\`): Invalid enum value. Expected 'words' | 'paragraphs', received 'chars'`,
      );
    });
  });

  describe('/rename room', () => {
    it('parses valid commands', () => {
      expectCommand('/rename room My Room').toReturn({
        tag: 'renameRoom',
        params: {
          newName: 'My Room',
        },
      });
    });

    it('validates the number of arguments', () => {
      expectCommand('/rename room').toErrorWith(
        'Error in command `/rename room`:',
        `* Received too few arguments. Expected: \`/rename room {name}\``,
      );
    });
  });

  describe('/rename user', () => {
    it('parses valid commands', () => {
      expectCommand('/rename user My User').toReturn({
        tag: 'renameUser',
        params: {
          newName: 'My User',
        },
      });
    });

    it('validates the number of arguments', () => {
      expectCommand('/rename user').toErrorWith(
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
