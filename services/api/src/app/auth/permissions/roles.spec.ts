import { Membership, MembershipStatus } from '@entities/membership.entity';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { defineRolesForUser } from './roles';
import { Role } from '@usecases/auth.service';

describe('defineRolesForUser', () => {
  const user = UserFactory.build();
  const otherUser = UserFactory.build();

  it('grants the owner manage permissions', () => {
    const room = RoomFactory.build({ ownerId: user.id });

    const userAbility = defineRolesForUser(user, []);
    const otherUserAbility = defineRolesForUser(otherUser, []);

    expect(userAbility.can(Role.Manage, room)).toEqual(true);
    expect(otherUserAbility.can(Role.Manage, room)).toEqual(false);
  });

  it('grants read and write permissions for joined rooms', () => {
    const room = RoomFactory.build({
      contentPolicy: ContentPolicy.Private,
    });
    const memberships: Membership[] = [
      {
        userId: user.id,
        roomId: room.id,
        status: MembershipStatus.Joined,
        from: 1000,
      },
    ];

    const userAbility = defineRolesForUser(user, memberships);
    const otherUserAbility = defineRolesForUser(otherUser, []);

    expect(userAbility.can(Role.Read, room)).toEqual(true);
    expect(userAbility.can(Role.Write, room)).toEqual(true);
    expect(userAbility.can(Role.Manage, room)).toEqual(false);

    expect(otherUserAbility.can(Role.Read, room)).toEqual(false);
    expect(otherUserAbility.can(Role.Write, room)).toEqual(false);
    expect(otherUserAbility.can(Role.Manage, room)).toEqual(false);
  });

  it('grants read permissions for public rooms', () => {
    const room = RoomFactory.build({
      contentPolicy: ContentPolicy.Public,
    });

    const userAbility = defineRolesForUser(user, []);

    expect(userAbility.can(Role.Read, room)).toEqual(true);
    expect(userAbility.can(Role.Write, room)).toEqual(false);
    expect(userAbility.can(Role.Manage, room)).toEqual(false);
  });

  it('grants join permissions for rooms with a public join policy', () => {
    const room = RoomFactory.build({
      joinPolicy: JoinPolicy.Anyone,
    });

    const userAbility = defineRolesForUser(user, []);

    expect(userAbility.can(Role.Join, room)).toEqual(true);
  });

  it('grants join permissions for invited users', () => {
    const room = RoomFactory.build({
      joinPolicy: JoinPolicy.Invite,
    });
    const memberships: Membership[] = [
      {
        userId: user.id,
        roomId: room.id,
        status: MembershipStatus.PendingInvite,
        from: 1000,
      },
    ];

    const userAbility = defineRolesForUser(user, memberships);
    const otherUserAbility = defineRolesForUser(otherUser, []);

    expect(userAbility.can(Role.Join, room)).toEqual(true);
    expect(otherUserAbility.can(Role.Join, room)).toEqual(false);
  });
});
