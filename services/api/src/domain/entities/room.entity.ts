export enum ContentPolicy {
  Public = 'public',
  Private = 'private',
}

export enum JoinPolicy {
  Anyone = 'anyone',
  Request = 'request',
  Invite = 'invite',
}

export class Room {
  id: string;
  ownerId: string;
  name: string;
  contentPolicy: ContentPolicy.Public | ContentPolicy.Private;
  joinPolicy: JoinPolicy.Anyone | JoinPolicy.Request | JoinPolicy.Invite;
}
