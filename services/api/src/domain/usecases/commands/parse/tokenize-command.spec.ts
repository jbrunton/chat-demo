import { tokenizeCommand } from '@usecases/commands/parse/tokenize-command';

describe('tokenizeCommand', () => {
  const roomId = 'room-id';
  const authorId = 'user-id';

  it('tokenizes commands', () => {
    expect(
      tokenizeCommand({ content: '/lorem 3 words', roomId, authorId }),
    ).toEqual({
      canonicalInput: '/lorem 3 words',
      roomId,
      tokens: ['lorem', '3', 'words'],
    });
  });

  it('derives a canonical form by ignoring excess whitespace', () => {
    expect(
      tokenizeCommand({ content: '/lorem    3  words', roomId, authorId }),
    ).toEqual({
      canonicalInput: '/lorem 3 words',
      roomId,
      tokens: ['lorem', '3', 'words'],
    });
  });
});
