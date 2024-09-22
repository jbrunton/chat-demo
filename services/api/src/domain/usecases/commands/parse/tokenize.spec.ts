import { tokenizeMessage } from '@usecases/commands/parse/tokenize';

describe('tokenizeMessage', () => {
  const roomId = 'room-id';
  const authorId = 'user-id';

  it('tokenizes commands', () => {
    expect(
      tokenizeMessage({ content: '/lorem 3 words', roomId, authorId }),
    ).toEqual({
      canonicalInput: '/lorem 3 words',
      roomId,
      tokens: ['lorem', '3', 'words'],
    });
  });

  it('derives a canonical form by ignoring excess whitespace', () => {
    expect(
      tokenizeMessage({ content: '/lorem    3  words', roomId, authorId }),
    ).toEqual({
      canonicalInput: '/lorem 3 words',
      roomId,
      tokens: ['lorem', '3', 'words'],
    });
  });
});
