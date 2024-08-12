import { parseMessage } from './parse-message';

describe('parseMessage', () => {
  const roomId = 'room-id';
  const authorId = 'user-id';

  it('parses commands', () => {
    expect(
      parseMessage({ content: '/lorem 3 words', roomId, authorId }),
    ).toEqual({
      canonicalInput: '/lorem 3 words',
      roomId,
      tokens: ['lorem', '3', 'words'],
    });
  });

  it('ignores excess whitespace in commands', () => {
    expect(
      parseMessage({ content: '/lorem    3  words', roomId, authorId }),
    ).toEqual({
      canonicalInput: '/lorem 3 words',
      roomId,
      tokens: ['lorem', '3', 'words'],
    });
  });

  it('parses normal messages', () => {
    expect(
      parseMessage({ content: 'Hello, World!', roomId, authorId }),
    ).toEqual({
      content: 'Hello, World!',
      roomId,
      authorId,
    });
  });
});
