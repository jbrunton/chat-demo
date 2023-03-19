import { MembershipStatus } from '@entities/membership.entity';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';
import { Entity } from 'dynamodb-onetable';

export const DbSchema = {
  format: 'onetable:1.1.0',
  version: '0.0.1',
  indexes: {
    primary: { hash: 'Id', sort: 'Sort' },
  },
  models: {
    User: {
      Id: { type: String, value: 'user:${sub}', required: true },
      Sort: { type: String, value: 'user', required: true },
      sub: { type: String, required: true },
      name: { type: String, required: true },
      picture: { type: String },
    },
    Message: {
      Id: { type: String, value: '${roomId}', required: true },
      Sort: { type: String, value: 'message:${uuid}', required: true },
      uuid: { type: String, generate: 'ulid', required: true },
      roomId: { type: String, required: true },
      content: { type: String, required: true },
      authorId: { type: String, required: true },
      time: { type: Number, required: true },
      recipientId: { type: String },
      updatedEntities: { type: Array },
    },
    Room: {
      Id: { type: String, value: 'room:${uuid}', required: true },
      Sort: { type: String, value: 'room', required: true },
      uuid: { type: String, generate: 'ulid', required: true },
      name: { type: String, required: true },
      ownerId: { type: String, required: true },
      contentPolicy: {
        type: String,
        enum: [ContentPolicy.Public, ContentPolicy.Private],
        required: true,
      },
      joinPolicy: {
        type: String,
        enum: [JoinPolicy.Anyone, JoinPolicy.Request, JoinPolicy.Invite],
        required: true,
      },
    },
    Membership: {
      Id: { type: String, value: '${userId}', required: true },
      Sort: {
        type: String,
        value: 'membership:${roomId}:${from}',
        required: true,
      },
      roomId: { type: String, required: true },
      userId: { type: String, required: true },
      status: {
        type: String,
        enum: [
          MembershipStatus.None,
          MembershipStatus.Joined,
          MembershipStatus.PendingApproval,
          MembershipStatus.Revoked,
        ],
        required: true,
      },
      from: { type: Number, required: true },
      until: { type: Number },
    },
  } as const,
  params: {
    timestamps: false,
  },
};

export type DbUser = Entity<typeof DbSchema.models.User>;
export type DbMessage = Entity<typeof DbSchema.models.Message>;
export type DbRoom = Entity<typeof DbSchema.models.Room>;
export type DbMembership = Entity<typeof DbSchema.models.Membership>;
