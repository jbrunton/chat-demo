import {
  CreateMembershipParams,
  MembershipsRepository,
} from '@entities/memberships.repository';
import { Membership } from '@entities/membership.entity';

export class TestMembershipsRepository extends MembershipsRepository {
  private memberships: Membership[] = [];

  getData() {
    return this.memberships;
  }

  setData(memberships: Membership[]) {
    this.memberships = memberships;
  }

  override async createMembership(
    params: CreateMembershipParams,
  ): Promise<Membership> {
    const now = new Date().getTime();
    this.memberships.forEach((membership) => {
      if (
        membership.userId === params.userId &&
        membership.roomId === membership.roomId
      ) {
        if (!membership.until || membership.until > now) {
          membership.until = now;
        }
      }
    });
    const membership: Membership = {
      ...params,
      from: now,
    };
    this.memberships.push(membership);
    return membership;
  }

  override async getMemberships(userId: string): Promise<Membership[]> {
    return this.memberships.filter(
      (membership) => membership.userId === userId,
    );
  }
}
