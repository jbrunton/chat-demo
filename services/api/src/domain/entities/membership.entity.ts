import { isNil } from 'rambda';
import { allPass } from 'remeda';

/**
 * The status of a user's membership to a room.
 */
export enum MembershipStatus {
  /**
   * The user has no membership.
   */
  None = 'None',

  /**
   * The user has joined the room.
   */
  Joined = 'Joined',

  /**
   * The user has been invited by an admin but has not accepted.
   */

  PendingInvite = 'PendingInvite',

  /**
   * The user has requested to join a room but is pending approval.
   */
  PendingApproval = 'PendingApproval',

  /**
   * The user's membership was revoked.
   */
  Revoked = 'Revoked',
}

/**
 * Record representing the membership status of a user in a room for a specific period.
 */
export type Membership = {
  /**
   * The user ID.
   */
  userId: string;

  /**
   * The room ID.
   */
  roomId: string;

  /**
   * The user's membership status for the given period.
   */
  status: MembershipStatus;

  /**
   * The start time of the period (inclusive) in ms since the epoch.
   */
  from: number;

  /**
   * The end time of the period (exclusive) in ms since the epoch. The current membership for a
   * user will have a null date.
   */
  until?: number;
};

export const isCurrent = (membership: Membership) => isNil(membership.until);

export const withStatus =
  (status: MembershipStatus) => (membership: Membership) =>
    membership.status === status;

export const forRoom = (roomId: string) => (membership: Membership) =>
  membership.roomId === roomId;

export const isActive = allPass([
  isCurrent,
  withStatus(MembershipStatus.Joined),
]);

export const isPendingInvite = allPass([
  isCurrent,
  withStatus(MembershipStatus.PendingInvite),
]);

export const isMemberOf = (roomId: string, memberships: Membership[]) =>
  memberships.some(allPass([isActive, forRoom(roomId)]));

export const hasInviteTo = (roomId: string, memberships: Membership[]) =>
  memberships.some(allPass([isPendingInvite, forRoom(roomId)]));
