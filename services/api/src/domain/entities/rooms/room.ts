export enum ContentPolicy {
  Public = 'public',
  Private = 'private',
}

export enum JoinPolicy {
  Anyone = 'anyone',
  Request = 'request',
  Invite = 'invite',
}

/**
 * Represents a chat room.
 */
export class Room {
  id: string;
  ownerId: string;
  name: string;
  contentPolicy: ContentPolicy;
  joinPolicy: JoinPolicy;
}
