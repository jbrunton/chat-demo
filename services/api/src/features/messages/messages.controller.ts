import { Controller, Get, Post, Body, Param, Sse } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Auth } from '@lib/auth/auth.decorator';
import { Identify } from '@lib/auth/identity/identify.decorator';
import { User } from '@entities/user.entity';
import { DispatcherService } from './dispatcher.service';

@Auth()
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly dispatcher: DispatcherService,
  ) {}

  @Post('/')
  saveMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Identify() user: User,
  ) {
    return this.messagesService.handleMessage(createMessageDto, user);
  }

  @Get('/:roomId')
  getMessages(@Param('roomId') roomId: string) {
    return this.messagesService.findForRoom(roomId);
  }

  @Sse('/:roomId/subscribe')
  subscribeMessages(@Param('roomId') roomId: string, @Identify() user: User) {
    return this.dispatcher.subscribe(roomId, user.id);
  }
}
