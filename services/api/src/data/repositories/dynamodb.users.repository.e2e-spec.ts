import { DynamoDBUsersRepository } from '@data/repositories/dynamodb/dynamodb.users.repository';
import { TestUsersRepository } from '@data/repositories/test/test.users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';
import { MockLoggerModule } from '@fixtures/MockLoggerModule';
import { AuthInfoFactory } from '@fixtures/auth/auth-info.factory';
import { omit } from 'remeda';
import { userParamsFromAuth } from '@entities/users/users-repository';

type TestCase = {
  name: 'DynamoDBUsersRepository' | 'TestUsersRepository';
};

describe('RoomsRepository', () => {
  let repos: {
    DynamoDBUsersRepository: DynamoDBUsersRepository;
    TestUsersRepository: TestUsersRepository;
  };

  const testCases: TestCase[] = [
    { name: 'DynamoDBUsersRepository' },
    { name: 'TestUsersRepository' },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule, MockLoggerModule],
      providers: [DynamoDBUsersRepository],
    }).compile();

    repos = {
      DynamoDBUsersRepository: moduleFixture.get(DynamoDBUsersRepository),
      TestUsersRepository: new TestUsersRepository(),
    };
  });

  test.each(testCases)('[$name] stores and finds users', async ({ name }) => {
    const repo = repos[name];

    const params = userParamsFromAuth(AuthInfoFactory.build());

    const user = await repo.saveUser(params);
    const found = await repo.getUser(user.id);

    expect(user).toMatchObject(omit(params, ['sub']));
    expect(found).toMatchObject(user);
  });

  test.each(testCases)('[$name] finds users by email', async ({ name }) => {
    const repo = repos[name];

    const params = userParamsFromAuth(AuthInfoFactory.build());

    const user = await repo.saveUser(params);
    const found = await repo.findUser(params.email);

    expect(found).toMatchObject(user);

    expect(await repo.findUser('not-a-user@example.com')).toBeNull();
  });

  test.each(testCases)('[$name] updates users', async ({ name }) => {
    const repo = repos[name];
    const params = userParamsFromAuth(AuthInfoFactory.build());
    const user = await repo.saveUser(params);

    const updated = await repo.updateUser({
      id: user.id,
      name: 'Renamed User',
    });
    const found = await repo.getUser(user.id);

    const expected = {
      id: user.id,
      name: 'Renamed User',
    };
    expect(updated).toMatchObject(expected);
    expect(found).toMatchObject(expected);
  });
});
