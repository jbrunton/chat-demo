import { Dispatcher } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { User } from '@entities/user.entity';
import { UsersRepository } from '@entities/users.repository';
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
    private readonly messages: MessagesRepository,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec(params: RenameUserParams): Promise<void> {
    const { roomId, newName, authenticatedUser } = params;

    await this.users.updateUser({
      id: authenticatedUser.id,
      name: newName,
    });

    const message = await this.messages.saveMessage({
      content: `User ${authenticatedUser.name} renamed to ${newName}`,
      roomId,
      authorId: 'system',
      updatedEntities: ['users'],
    });

    this.dispatcher.emit(message);
  }
}
