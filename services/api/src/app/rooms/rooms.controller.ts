import { Auth } from '@app/auth/auth.decorator';
import { Identify } from '@app/auth/auth0/identify.decorator';
import { ConsoleLogger, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@entities/users/user.entity';
import { CreateRoomUseCase } from '@usecases/rooms/create';
import { GetRoomUseCase } from '@usecases/rooms/get';
import { JoinRoomUseCase } from '@usecases/memberships/join';

@Auth()
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly create: CreateRoomUseCase,
    private readonly get: GetRoomUseCase,
    private readonly join: JoinRoomUseCase,
    private readonly logger: ConsoleLogger,
  ) {
    logger.setContext(RoomsController.name);
  }

  @Post('/')
  async createRoom(@Identify() user: User) {
    const room = await this.create.exec(user);
    this.logger.log('created room:' + JSON.stringify(room));
    return { room };
  }

  @Get('/:roomId')
  async getRoom(@Param('roomId') roomId: string, @Identify() user: User) {
    return this.get.exec(roomId, user);
  }

  @Post('/:roomId/join')
  async joinRoom(@Param('roomId') roomId: string, @Identify() user: User) {
    await this.join.exec(roomId, user);
  }
}
