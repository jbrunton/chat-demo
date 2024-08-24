import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import {
  Membership,
  isActive,
  isPendingInvite,
} from '@entities/membership.entity';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';
import { User } from '@entities/users';
import { Role } from '@usecases/auth.service';
import { filter, pipe, map, prop } from 'remeda';

export const defineRolesForUser = (user: User, memberships: Membership[]) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  const joinedRoomIds = pipe(
    memberships,
    filter(isActive),
    map(prop('roomId')),
  );

  const pendingInviteRoomIds = pipe(
    memberships,
    filter(isPendingInvite),
    map(prop('roomId')),
  );

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
