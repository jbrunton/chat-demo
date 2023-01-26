import { Auth } from '@app/auth/auth.decorator';
import { UsersRepository } from '@entities/users.repository';
import { Controller, Get, Param } from '@nestjs/common';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersRepo: UsersRepository) {}

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
