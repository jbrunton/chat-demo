import { AuthService, Role } from '@entities/auth';
import { DraftMessage } from '@entities/message.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';

export type RenameRoomParams = {
  roomId: string;
  authenticatedUser: User;
  newName: string;
};

export const renameRoom = async (
  params: RenameRoomParams,
  roomsRepo: RoomsRepository,
  authService: AuthService,
): Promise<DraftMessage> => {
  const { roomId, newName, authenticatedUser } = params;

  const room = await roomsRepo.getRoom(roomId);

  await authService.authorize({
    user: authenticatedUser,
    action: Role.Manage,
    subject: room,
    message: 'You cannot rename this room. Only the owner can do this.',
  });

  await roomsRepo.updateRoom({
    id: roomId,
    name: newName,
  });

  return {
    content: `Room renamed to ${newName}`,
    roomId,
    authorId: 'system',
    updatedEntities: ['room'],
  };
};
