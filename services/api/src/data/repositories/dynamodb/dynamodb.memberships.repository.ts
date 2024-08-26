import { Membership } from '@entities/membership.entity';
import {
  CreateMembershipParams,
  MembershipsRepository,
} from '@entities/memberships.repository';
import { Injectable } from '@nestjs/common';
import { pick } from 'rambda';
import { DynamoDBAdapter } from '../../adapters/dynamodb/dynamodb.adapter';
import { DbMembership } from '../../adapters/dynamodb/schema';

@Injectable()
export class DynamoDBMembershipsRepository extends MembershipsRepository {
  constructor(private readonly adapter: DynamoDBAdapter) {
    super();
  }

  override async createMembership(
    params: CreateMembershipParams,
  ): Promise<Membership> {
    const now = new Date().getTime();

    const [openMembership] = await this.adapter.Membership.find(
      {
        userId: params.userId,
        roomId: params.roomId,
      },
      {
        where: 'attribute_not_exists(${until})',
        hidden: true,
      },
    );

    if (openMembership) {
      await this.adapter.Membership.update({
        Id: openMembership.Id,
        Sort: openMembership.Sort,
        until: now,
      });
    }

    const membership = await this.adapter.Membership.create({
      ...params,
      from: now,
    });

    return membershipFromRecord(membership);
  }

  override async getMemberships(userId: string): Promise<Membership[]> {
    const memberships = await this.adapter.Membership.find({ Id: userId });
    return memberships.map(membershipFromRecord);
  }
}

const membershipFromRecord = (record: DbMembership): Membership => ({
  ...pick(['userId', 'roomId', 'status', 'from', 'until'], record),
});
