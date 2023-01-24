import { Draft, PublicMessage } from '@entities/message.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';

export type RenameRoomParams = {
  roomId: string;
  authenticatedUser: User;
  newName: string;
};

export const renameRoomResponse = async (
  params: RenameRoomParams,
  roomsRepo: RoomsRepository,
): Promise<Draft<PublicMessage>> => {
  const { roomId, newName } = params;

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
