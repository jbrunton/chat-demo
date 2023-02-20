import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Membership, MembershipStatus } from '@entities/membership.entity';
import { User } from '@entities/user.entity';
import { pluck } from 'rambda';

export const defineRolesForUser = (user: User, memberships: Membership[]) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);
  const activeMemberships = memberships.filter(
    (membership) =>
      !membership.until && membership.status === MembershipStatus.Joined,
  );
  const roomIds = pluck('roomId', activeMemberships);

  can('manage', 'Room', {
    ownerId: user.id,
  });

  can('write', 'Room', {
    id: { $in: roomIds },
  });

  can('read', 'Room', {
    contentPolicy: 'public',
  });
  can('read', 'Room', {
    id: { $in: roomIds },
  });

  return build();
};
