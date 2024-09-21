import { faker } from '@faker-js/faker';
import { SentMessage } from '@entities/messages/message';
import { RoomFactory } from './room.factory';
import { UserFactory } from './user.factory';
import { mergeAll } from 'rambda';

export const MessageFactory = {
  build: (overrides?: Partial<SentMessage>): SentMessage => {
    const time = overrides?.time ?? new Date().getTime();
    return mergeAll([
      {
        id: overrides?.id ?? `Msg#${time}#${faker.datatype.uuid()}`,
        content: overrides?.content ?? faker.lorem.words(),
        time,
        roomId: overrides?.roomId ?? RoomFactory.id(),
        authorId: overrides?.authorId ?? UserFactory.id(),
      },
      overrides?.recipientId
        ? {
            recipientId: overrides.recipientId,
          }
        : {},
    ]);
  },
};
