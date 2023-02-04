import { Auth } from '@app/auth/auth.decorator';
import { Identify } from '@app/auth/identity/identify.decorator';
import { MessagesRepository } from '@entities/messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { UsersRepository } from '@entities/users.repository';
import { Controller, Get, Param } from '@nestjs/common';
import { pluck, uniq } from 'rambda';

@Auth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly messagesRepo: MessagesRepository,
    private readonly roomsRepo: RoomsRepository,
  ) {}

  @Get('/me')
  async getAuthenticatedUserDetails(@Identify() user: User) {
    const messageHistory = await this.messagesRepo.getAuthorHistory(user.id);
    const roomIds = uniq(pluck('roomId', messageHistory));
    const rooms = await Promise.all(
      roomIds.map((roomId) => this.roomsRepo.getRoom(roomId)),
    );
    return {
      user,
      rooms,
    };
  }

  @Get('/:userId')
  async getUser(@Param('userId') userId: string) {
    if (userId === 'system') {
      return {
        id: 'system',
        name: 'System',
      };
    }
    return await this.usersRepo.getUser(userId);
  }
}
