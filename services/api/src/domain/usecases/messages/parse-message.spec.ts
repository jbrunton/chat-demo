import { tokenizeMessage } from '@usecases/commands/tokenize';

describe('parseMessage', () => {
  const roomId = 'room-id';
  const authorId = 'user-id';

  it('parses commands', () => {
    expect(
      tokenizeMessage({ content: '/lorem 3 words', roomId, authorId }),
    ).toEqual({
      canonicalInput: '/lorem 3 words',
      roomId,
      tokens: ['lorem', '3', 'words'],
    });
  });

  it('ignores excess whitespace in commands', () => {
    expect(
      tokenizeMessage({ content: '/lorem    3  words', roomId, authorId }),
    ).toEqual({
      canonicalInput: '/lorem 3 words',
      roomId,
      tokens: ['lorem', '3', 'words'],
    });
  });
});
