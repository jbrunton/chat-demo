import { faker } from '@faker-js/faker';
import { AuthInfo } from '@entities/auth';

export const AuthInfoFactory = {
  build: (overrides?: Partial<AuthInfo>): AuthInfo => ({
    sub: overrides?.sub ?? `google-${faker.datatype.uuid()}`,
    name: overrides?.name ?? faker.name.fullName(),
    picture: overrides?.picture ?? faker.internet.avatar(),
  }),
};
