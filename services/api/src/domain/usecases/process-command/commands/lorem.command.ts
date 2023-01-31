import { Draft, Message } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { faker } from '@faker-js/faker';

type LoremType = 'words' | 'paragraphs';

export type LoremParams = {
  roomId: string;
  authenticatedUser: User;
  countToken?: string;
  typeToken?: string;
};

export const loremResponse = (params: LoremParams): Draft<Message> => {
  const { roomId, authenticatedUser, countToken, typeToken } = params;
  const authorId = 'system';
  if (!countToken || !typeToken) {
    const content =
      "Missing params. Required: 'lorem <count> <words | paragraphs>";
    return { content, roomId, recipientId: authenticatedUser.id, authorId };
  }

  const count = Number(countToken);
  if (count <= 0 || count > 20) {
    const content = '`count` must be between 1 and 20';
    return { content, roomId, recipientId: authenticatedUser.id, authorId };
  }

  if (!['words', 'paragraphs'].includes(typeToken)) {
    const content = '`type` must be `words` or `paragraphs`';
    return { content, roomId, recipientId: authenticatedUser.id, authorId };
  }

  const loremType = typeToken as LoremType;
  const content = faker.lorem[loremType](count);
  return {
    content,
    roomId,
    authorId: 'system',
  };
};
