import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Membership, MembershipStatus } from '@entities/membership.entity';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';
import { User } from '@entities/user.entity';
import { Role } from '@usecases/auth.service';
import { pluck } from 'rambda';

export const defineRolesForUser = (user: User, memberships: Membership[]) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  const activeMemberships = memberships.filter(
    (membership) =>
      !membership.until && membership.status === MembershipStatus.Joined,
  );
  const roomIds = pluck('roomId', activeMemberships);

  can(Role.Manage, 'Room', {
    ownerId: user.id,
  });

  can(Role.Write, 'Room', {
    id: { $in: roomIds },
  });

  can(Role.Read, 'Room', {
    contentPolicy: ContentPolicy.Public,
  });
  can(Role.Read, 'Room', {
    id: { $in: roomIds },
  });

  can(Role.Join, 'Room', {
    joinPolicy: JoinPolicy.Anyone,
  });

  return build();
};
