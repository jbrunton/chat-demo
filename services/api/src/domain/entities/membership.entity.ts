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

/**
 * Determines whether a membership record is current or historical, return true if current.
 * @param membership The membership record
 * @returns true if the record is current
 */
export const isCurrent = (membership: Membership) => isNil(membership.until);

/**
 * Returns a predicate for filtering membership records according to the given status.
 * @param status The status to filter on
 * @returns A predicate for filtering membership records
 */
export const withStatus =
  (status: MembershipStatus) => (membership: Membership) =>
    membership.status === status;

/**
 * Returns a predicate for filtering membership records to the given room.
 * @param roomId The roomId to filter on
 * @returns A predicate for filtering membership records
 */
export const forRoom = (roomId: string) => (membership: Membership) =>
  membership.roomId === roomId;

/**
 * Predicate to filter for active membership records, i.e. current and where the status is `Joined`.
 * @param data The membership record
 */
export const isActive = allPass([
  isCurrent,
  withStatus(MembershipStatus.Joined),
]);

/**
 * Predicate to filter for pending invitation records, i.e. current and where the status is `PendingInvite`.
 * @param data The membership record
 */
export const isPendingInvite = allPass([
  isCurrent,
  withStatus(MembershipStatus.PendingInvite),
]);

/**
 * Predicate to filter for pending request records, i.e. current and where the status is `PendingRequest`.
 * @param data The membership record
 */
export const isPendingApproval = allPass([
  isCurrent,
  withStatus(MembershipStatus.PendingApproval),
]);

/**
 * Returns true if the user is a member of the given room.
 * @param roomId The roomId
 * @param memberships The user's membership records
 * @returns `true` if the user has an active membership record for the room
 */
export const isMemberOf = (roomId: string, memberships: Membership[]) =>
  memberships.some(allPass([isActive, forRoom(roomId)]));

/**
 * Returns true if the user has a pending invite to the given room.
 * @param roomId The roomId
 * @param memberships The user's membership records
 * @returns `true` if the user has a pending invite to the room
 */
export const hasPendingInviteTo = (roomId: string, memberships: Membership[]) =>
  memberships.some(allPass([isPendingInvite, forRoom(roomId)]));

/**
 * Returns true if the user has a pending request to the given room.
 * @param roomId The roomId
 * @param memberships The user's membership records
 * @returns `true` if the user has a pending request to the room
 */
export const hasPendingRequestTo = (
  roomId: string,
  memberships: Membership[],
) => memberships.some(allPass([isPendingApproval, forRoom(roomId)]));
