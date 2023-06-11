import { MembershipStatus } from '@entities/membership.entity';
import { CreateMembershipParams } from '@entities/memberships.repository';
import { TestMembershipsRepository } from '@fixtures/data/test.memberships.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';
import { DynamoDBMembershipsRepository } from './dynamodb.memberships.repository';
import { LoggerModule } from '@app/app.logger';

type TestCase = {
  name: 'DynamoDBMembershipsRepository' | 'TestMembershipsRepository';
};

describe('MembershipsRepository', () => {
  let repos: {
    DynamoDBMembershipsRepository: DynamoDBMembershipsRepository;
    TestMembershipsRepository: TestMembershipsRepository;
  };

  const testCases: TestCase[] = [
    { name: 'DynamoDBMembershipsRepository' },
    { name: 'TestMembershipsRepository' },
  ];

  const now = 1000;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule, LoggerModule],
      providers: [DynamoDBMembershipsRepository],
    }).compile();

    repos = {
      DynamoDBMembershipsRepository: moduleFixture.get(
        DynamoDBMembershipsRepository,
      ),
      TestMembershipsRepository: new TestMembershipsRepository(),
    };

    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  test.each(testCases)(
    '[$name] stores and finds memberships',
    async ({ name }) => {
      const repo = repos[name];

      const { id: userId } = UserFactory.build();
      const { id: roomId } = RoomFactory.build();
      const params: CreateMembershipParams = {
        userId,
        roomId,
        status: MembershipStatus.Joined,
      };

      const membership = await repo.createMembership(params);
      const found = await repo.getMemberships(userId);

      const expected = {
        ...params,
        from: now,
      };
      expect(membership).toMatchObject(expected);
      expect(found).toMatchObject([expected]);
    },
  );

  test.each(testCases)('[$name] truncates memberships', async ({ name }) => {
    const repo = repos[name];
    const { id: userId } = UserFactory.build();
    const { id: roomId } = RoomFactory.build();
    const params = {
      userId,
      roomId,
    };

    const t1 = now;
    jest.setSystemTime(t1);
    await repo.createMembership({
      ...params,
      status: MembershipStatus.PendingApproval,
    });

    const t2 = now + 1;
    jest.setSystemTime(t2);
    await repo.createMembership({
      ...params,
      status: MembershipStatus.Joined,
    });

    const t3 = now + 2;
    jest.setSystemTime(t3);
    await repo.createMembership({
      ...params,
      status: MembershipStatus.Revoked,
    });

    const memberships = await repo.getMemberships(userId);

    expect(memberships).toEqual([
      {
        ...params,
        status: MembershipStatus.PendingApproval,
        from: 1000,
        until: 1001,
      },
      {
        ...params,
        status: MembershipStatus.Joined,
        from: 1001,
        until: 1002,
      },
      {
        ...params,
        status: MembershipStatus.Revoked,
        from: 1002,
      },
    ]);
  });
});
