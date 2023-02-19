import { Auth } from '@app/auth/auth.decorator';
import { Identify } from '@app/auth/identity/identify.decorator';
import { Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { User } from '@entities/user.entity';

@Auth()
@Controller('rooms')
export class RoomsController {
  private readonly logger = new Logger(RoomsController.name);

  constructor(private readonly roomsService: RoomsService) {}

  @Post('/')
  async createRoom(@Identify() user: User) {
    const room = await this.roomsService.createRoom(user);
    this.logger.log('created room:' + JSON.stringify(room));
    return { room };
  }

  @Get('/:roomId')
  async getRoom(@Param('roomId') roomId: string) {
    const room = await this.roomsService.getRoom(roomId);
    return { room };
  }

  @Post('/:roomId/join')
  async joinRoom(@Param('roomId') roomId: string, @Identify() user: User) {
    await this.roomsService.joinRoom(roomId, user);
  }
}
