import { isNil } from 'rambda';
import { allPass, filter, first, map, pipe, prop, unique } from 'remeda';

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
 *
 * A user will have a history of zero or more non-overlapping `Membership` records for each room.
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
const isCurrent = (membership: Membership) => isNil(membership.until);

/**
 * Returns a predicate for filtering membership records according to the given status.
 * @param status The status to filter on
 * @returns A predicate for filtering membership records
 */
const withStatus = (status: MembershipStatus) => (membership: Membership) =>
  membership.status === status;

/**
 * Predicate to filter for active membership records, i.e. current and where the status is `Joined`.
 * @param data The membership record
 */
const isActive = allPass([isCurrent, withStatus(MembershipStatus.Joined)]);

/**
 * Returns a predicate for filtering membership records to the given room.
 * @param roomId The room ID to filter on
 * @returns A predicate for filtering membership records
 */
const forRoom = (roomId: string) => (membership: Membership) =>
  membership.roomId === roomId;

/**
 * Returns the membership status of a user in a given room.
 * @param roomId The room ID
 * @param memberships The user's membership history
 * @returns The status of the current membership record for the room (and None if no current record exists)
 */
export const getMembershipStatus = (
  roomId: string,
  memberships: Membership[],
): MembershipStatus =>
  pipe(
    memberships,
    filter(allPass([isCurrent, forRoom(roomId)])),
    map(prop('status')),
    first(),
  ) ?? MembershipStatus.None;

/**
 * Identifies the rooms the user is a current member of.
 * @param memberships The user's membership history
 * @returns Array of room IDs.
 */
export const getActiveRooms = (memberships: Membership[]): string[] => {
  return pipe(memberships, filter(isActive), map(prop('roomId')), unique());
};

/**
 * Identifies the rooms which the user has a current membership of matching the given status
 * @param status The status to match on
 * @param memberships The user's membership history
 * @returns Array of room IDs
 */
export const getRoomsWithStatus = (
  status: MembershipStatus,
  memberships: Membership[],
): string[] =>
  pipe(
    memberships,
    filter(allPass([isCurrent, withStatus(status)])),
    map(prop('roomId')),
  );
