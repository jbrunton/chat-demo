import { Auth } from '@app/auth/auth.decorator';
import { AuthInfo } from '@entities/auth-info';
import { Identify } from '@app/auth/identity/identify.decorator';
import { Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Auth()
@Controller('rooms')
export class RoomsController {
  private readonly logger = new Logger(RoomsController.name);

  constructor(private readonly roomsService: RoomsService) {}

  @Post('/')
  async createRoom(@Identify() auth: AuthInfo) {
    const room = await this.roomsService.createRoom(auth);
    this.logger.log('created room:' + JSON.stringify(room));
    return { room };
  }

  @Get('/:roomId')
  async getRoom(@Param('roomId') roomId: string) {
    const room = await this.roomsService.getRoom(roomId);
    return { room };
  }
}
