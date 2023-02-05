import { Membership, MembershipStatus } from './membership.entity';

export type CreateMembershipParams = Pick<
  Membership,
  'userId' | 'roomId' | 'status'
> & {
  status: MembershipStatus;
};

export abstract class MembershipsRepository {
  abstract createMembership(
    params: CreateMembershipParams,
  ): Promise<Membership>;
  abstract getMemberships(userId: string): Promise<Membership[]>;
}
