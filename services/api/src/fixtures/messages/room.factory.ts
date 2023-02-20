import { subject } from '@casl/ability';
import { ContentPolicy, JoinPolicy, Room } from '@entities/room.entity';
import { faker } from '@faker-js/faker';
import { UserFactory } from './user.factory';

export const RoomFactory = {
  id: () => `room:${faker.datatype.uuid()}`,
  build: (overrides?: Partial<Room>): Room =>
    subject('Room', {
      id: overrides?.id ?? RoomFactory.id(),
      name: overrides?.name ?? `${faker.word.adjective()}-${faker.word.noun()}`,
      ownerId: overrides?.ownerId ?? UserFactory.id(),
      contentPolicy: overrides?.contentPolicy ?? ContentPolicy.Private,
      joinPolicy: overrides?.joinPolicy ?? JoinPolicy.Invite,
    }),
};
