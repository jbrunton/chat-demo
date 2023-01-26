import { TestUsersRepository } from '@fixtures/data/test.users.repository';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { renameUser } from './rename-user.command';

describe('renameUser', () => {
  let usersRepo: TestUsersRepository;

  const originalName = 'Original User Name';
  const newName = 'New User Name';

  const authenticatedUser = UserFactory.build({
    name: originalName,
  });

  const room = RoomFactory.build({
    ownerId: authenticatedUser.id,
    name: originalName,
  });
  const roomId = room.id;

  beforeEach(() => {
    usersRepo = new TestUsersRepository();
    usersRepo.setData([authenticatedUser]);
  });

  it('renames the user', async () => {
    const response = await renameUser(
      {
        roomId,
        authenticatedUser,
        newName,
      },
      usersRepo,
    );

    const updatedUser = await usersRepo.getUser(authenticatedUser.id);
    expect(response).toEqual({
      content: 'User Original User Name renamed to New User Name',
      authorId: 'system',
      roomId,
      updatedEntities: ['users'],
    });
    expect(updatedUser).toMatchObject({
      name: newName,
    });
  });
});
