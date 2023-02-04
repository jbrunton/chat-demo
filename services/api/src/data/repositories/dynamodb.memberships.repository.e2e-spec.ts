import { MembershipStatus } from '@entities/membership.entity';
import { CreateMembershipParams } from '@entities/memberships.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from '../data.module';
import { DynamoDBMembershipsRepository } from './dynamodb.memberships.repository';

describe('DynamoDBMembershipsRepository', () => {
  let membershipsRepo: DynamoDBMembershipsRepository;
  const now = 1000;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [DynamoDBMembershipsRepository],
    }).compile();

    membershipsRepo = moduleFixture.get(DynamoDBMembershipsRepository);

    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  it('stores and finds memberships', async () => {
    const { id: userId } = UserFactory.build();
    const { id: roomId } = RoomFactory.build();
    const params: CreateMembershipParams = {
      userId,
      roomId,
      status: MembershipStatus.Joined,
    };

    const membership = await membershipsRepo.createMembership(params);
    const found = await membershipsRepo.getMemberships(userId);

    const expected = {
      ...params,
      from: now,
    };
    expect(membership).toMatchObject(expected);
    expect(found).toMatchObject([expected]);
  });

  it('truncates memberships', async () => {
    const { id: userId } = UserFactory.build();
    const { id: roomId } = RoomFactory.build();
    const params = {
      userId,
      roomId,
    };

    const t1 = now;
    jest.setSystemTime(t1);
    await membershipsRepo.createMembership({
      ...params,
      status: MembershipStatus.PendingApproval,
    });

    const t2 = now + 1;
    jest.setSystemTime(t2);
    await membershipsRepo.createMembership({
      ...params,
      status: MembershipStatus.Joined,
    });

    const t3 = now + 2;
    jest.setSystemTime(t3);
    await membershipsRepo.createMembership({
      ...params,
      status: MembershipStatus.Revoked,
    });

    const memberships = await membershipsRepo.getMemberships(userId);

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
