import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import {
  Membership,
  MembershipStatus,
  getRoomsWithStatus,
} from '@entities/memberships/membership';
import { ContentPolicy, JoinPolicy } from '@entities/rooms/room';
import { User } from '@entities/users/user';
import { Role } from '@usecases/auth-service';

export const defineRolesForUser = (user: User, memberships: Membership[]) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  const joinedRoomIds = getRoomsWithStatus(
    MembershipStatus.Joined,
    memberships,
  );

  const pendingInviteRoomIds = getRoomsWithStatus(
    MembershipStatus.PendingInvite,
    memberships,
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
    joinPolicy: { $in: [JoinPolicy.Anyone, JoinPolicy.Request] },
  });
  can(Role.Join, 'Room', {
    id: { $in: pendingInviteRoomIds },
  });

  return build();
};
