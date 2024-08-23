import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Membership, MembershipStatus } from '@entities/membership.entity';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';
import { User } from '@entities/users';
import { Role } from '@usecases/auth.service';
import { pluck } from 'rambda';

export const defineRolesForUser = (user: User, memberships: Membership[]) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  const activeMemberships = memberships.filter(
    (membership) =>
      !membership.until && membership.status === MembershipStatus.Joined,
  );
  const joinedRoomIds = pluck('roomId', activeMemberships);

  const pendingInvitations = memberships.filter(
    (membership) =>
      !membership.until && membership.status === MembershipStatus.PendingInvite,
  );
  const pendingInviteRoomIds = pluck('roomId', pendingInvitations);

  console.info({ memberships, joinedRoomIds, pendingInviteRoomIds });

  can(Role.Manage, 'Room', {
    ownerId: user.id,
  });

  can(Role.Write, 'Room', {
    id: { $in: joinedRoomIds },
  });

  can(Role.Read, 'Room', {
    contentPolicy: ContentPolicy.Public,
  });
  can(Role.Read, 'Room', {
    id: { $in: joinedRoomIds },
  });

  can(Role.Join, 'Room', {
    joinPolicy: JoinPolicy.Anyone,
  });
  can(Role.Join, 'Room', {
    id: { $in: pendingInviteRoomIds },
  });

  return build();
};
