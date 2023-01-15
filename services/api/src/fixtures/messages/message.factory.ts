import { faker } from '@faker-js/faker';
import { Message } from 'src/domain/entities/message.entity';
import { UserFactory } from './user.factory';

export const MessageFactory = {
  build: (overrides?: Partial<Message>): Message => {
    const time = overrides?.time ?? new Date().getTime();
    return {
      id: overrides?.id ?? `Msg#${time}#${faker.datatype.uuid()}`,
      content: overrides?.content ?? faker.lorem.words(),
      time,
      roomId: overrides?.roomId ?? `Room#${faker.datatype.number()}`,
      authorId: overrides?.authorId ?? UserFactory.id(),
    };
  },
};
