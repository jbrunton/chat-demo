import { DraftMessage } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { UsersRepository } from '@entities/users.repository';

export type RenameUserParams = {
  roomId: string;
  authenticatedUser: User;
  newName: string;
};

export const renameUser = async (
  params: RenameUserParams,
  usersRepo: UsersRepository,
): Promise<DraftMessage> => {
  const { roomId, newName, authenticatedUser } = params;

  await usersRepo.updateUser({
    id: authenticatedUser.id,
    name: newName,
  });

  return {
    content: `User ${authenticatedUser.name} renamed to ${newName}`,
    roomId,
    authorId: 'system',
    updatedEntities: ['users'],
  };
};
