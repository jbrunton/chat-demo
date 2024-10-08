import {
  Dispatcher,
  DraftMessage,
  UpdatedEntity,
} from '@entities/messages/message';
import { User } from '@entities/users/user';
import { UsersRepository } from '@entities/users/users-repository';
import { Injectable } from '@nestjs/common';

export type RenameUserParams = {
  roomId: string;
  authenticatedUser: User;
  newName: string;
};

@Injectable()
export class RenameUserUseCase {
  constructor(
    private readonly users: UsersRepository,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec(params: RenameUserParams): Promise<void> {
    const { roomId, newName, authenticatedUser } = params;

    await this.users.updateUser({
      id: authenticatedUser.id,
      name: newName,
    });

    const message: DraftMessage = {
      content: `User ${authenticatedUser.name} renamed to ${newName}`,
      roomId,
      authorId: 'system',
      updatedEntities: [UpdatedEntity.Users],
    };

    this.dispatcher.send(message);
  }
}
