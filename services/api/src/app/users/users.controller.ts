import { Auth } from '@app/auth/auth.decorator';
import { Identify } from '@app/auth/auth0/identify.decorator';
import { User } from '@entities/users/user';
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getAuthenticatedUserDetails(@Identify() user: User) {
    const rooms = await this.usersService.getUserRooms(user.id);
    return {
      user,
      rooms,
    };
  }

  @Get('/:userId')
  async getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }
}
