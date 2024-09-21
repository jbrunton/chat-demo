import { User } from '@entities/users/user';
import { faker } from '@faker-js/faker';

export const UserFactory = {
  id: () => `user:google-${faker.datatype.uuid()}`,
  build: (overrides?: Partial<User>): User => ({
    id: overrides?.id ?? UserFactory.id(),
    name: overrides?.name ?? faker.name.fullName(),
    email: overrides?.email ?? faker.internet.email(),
    picture: overrides?.picture ?? faker.internet.avatar(),
  }),
};
