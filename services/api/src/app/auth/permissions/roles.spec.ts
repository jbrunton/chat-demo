import { Membership, MembershipStatus } from '@entities/membership.entity';
import { ContentPolicy } from '@entities/room.entity';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { defineRolesForUser } from './roles';

describe('defineRolesForUser', () => {
  const user = UserFactory.build();
  const otherUser = UserFactory.build();

  it('grants the owner manage permissions', () => {
    const room = RoomFactory.build({ ownerId: user.id });

    const userAbility = defineRolesForUser(user, []);
    const otherUserAbility = defineRolesForUser(otherUser, []);

    expect(userAbility.can('manage', room)).toEqual(true);
    expect(otherUserAbility.can('manage', room)).toEqual(false);
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

    expect(userAbility.can('read', room)).toEqual(true);
    expect(userAbility.can('write', room)).toEqual(true);
    expect(userAbility.can('manage', room)).toEqual(false);

    expect(otherUserAbility.can('read', room)).toEqual(false);
    expect(otherUserAbility.can('write', room)).toEqual(false);
    expect(otherUserAbility.can('manage', room)).toEqual(false);
  });

  it('grants read permissions for public rooms', () => {
    const room = RoomFactory.build({
      contentPolicy: ContentPolicy.Public,
    });

    const userAbility = defineRolesForUser(user, []);

    expect(userAbility.can('read', room)).toEqual(true);
    expect(userAbility.can('write', room)).toEqual(false);
    expect(userAbility.can('manage', room)).toEqual(false);
  });
});
