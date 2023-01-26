import { Room } from '@entities/room.entity';
import { faker } from '@faker-js/faker';
import { UserFactory } from './user.factory';

export const RoomFactory = {
  id: () => `room:${faker.datatype.uuid()}`,
  build: (overrides?: Partial<Room>): Room => ({
    id: overrides?.id ?? RoomFactory.id(),
    name: overrides?.name ?? `${faker.word.adjective()}-${faker.word.noun()}`,
    ownerId: overrides?.ownerId ?? UserFactory.id(),
  }),
};
