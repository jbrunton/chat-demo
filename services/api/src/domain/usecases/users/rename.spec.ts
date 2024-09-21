import { RenameUserUseCase } from './rename';
import { mock, MockProxy } from 'jest-mock-extended';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UserFactory } from '@fixtures/messages/user.factory';
import { TestUsersRepository } from '@data/repositories/test/test.users.repository';
import { Dispatcher } from '@entities/messages/message';

describe('RenameUserUseCase', () => {
  let rename: RenameUserUseCase;
  let users: TestUsersRepository;
  let dispatcher: MockProxy<Dispatcher>;

  const originalName = 'Original User Name';
  const newName = 'New User Name';

  const user = UserFactory.build({ name: originalName });
  const room = RoomFactory.build();

  beforeEach(() => {
    users = new TestUsersRepository();
    users.setData([user]);

    dispatcher = mock<Dispatcher>();

    rename = new RenameUserUseCase(users, dispatcher);
  });

  it('renames the user', async () => {
    await rename.exec({
      roomId: room.id,
      authenticatedUser: user,
      newName,
    });

    const updatedUser = await users.getUser(user.id);
    expect(updatedUser.name).toEqual(newName);
  });

  it('sends a notification', async () => {
    await rename.exec({
      roomId: room.id,
      authenticatedUser: user,
      newName,
    });

    expect(dispatcher.send).toHaveBeenCalledWith({
      content: `User ${originalName} renamed to ${newName}`,
      authorId: 'system',
      roomId: room.id,
      updatedEntities: ['users'],
    });
  });
});
