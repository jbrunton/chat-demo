import { TestMembershipsRepository } from '@fixtures/data/test.memberships.repository';
import { TestRoomsRepository } from '@fixtures/data/test.rooms.repository';
import { UserFactory } from '@fixtures/messages/user.factory';
import { CreateRoomUseCase } from './create';
import { ContentPolicy, JoinPolicy } from '@entities/room.entity';

describe('CreateRoomUseCase', () => {
  let create: CreateRoomUseCase;
  let rooms: TestRoomsRepository;
  let memberships: TestMembershipsRepository;

  const owner = UserFactory.build();

  const now = new Date(1000);

  beforeEach(() => {
    rooms = new TestRoomsRepository();
    memberships = new TestMembershipsRepository();
    create = new CreateRoomUseCase(rooms, memberships);
    jest.useFakeTimers({ now });
  });

  it('creates a room', async () => {
    const room = await create.exec(owner);
    expect(room).toMatchObject({
      ownerId: owner.id,
      contentPolicy: ContentPolicy.Private,
      joinPolicy: JoinPolicy.Anyone,
    });
  });

  it('assigns membership to the owner', async () => {
    const room = await create.exec(owner);
    expect(memberships.getData()).toEqual([
      {
        roomId: room.id,
        userId: owner.id,
        status: 'Joined',
        from: now.getTime(),
      },
    ]);
  });
});
