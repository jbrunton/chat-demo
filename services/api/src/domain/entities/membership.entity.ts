export enum MembershipStatus {
  None = 'None',
  Joined = 'Joined',
  PendingApproval = 'PendingApproval',
  Revoked = 'Revoked',
}

export type Membership = {
  userId: string;
  roomId: string;
  status: MembershipStatus;
  from: number;
  until?: number;
};
