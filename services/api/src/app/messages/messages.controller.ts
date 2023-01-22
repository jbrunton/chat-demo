import { Controller, Get, Post, Body, Param, Sse } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Auth } from '@app/auth/auth.decorator';
import { Identify } from '@app/auth/identity/identify.decorator';
import { DispatcherService } from './dispatcher.service';
import { AuthInfo } from '@entities/auth-info';

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
    @Identify() auth: AuthInfo,
  ) {
    return this.messagesService.handleMessage(createMessageDto, auth);
  }

  @Get('/:roomId')
  getMessages(@Param('roomId') roomId: string) {
    return this.messagesService.findForRoom(roomId);
  }

  @Sse('/:roomId/subscribe')
  subscribeMessages(
    @Param('roomId') roomId: string,
    @Identify() auth: AuthInfo,
  ) {
    return this.dispatcher.subscribe(roomId, auth);
  }
}
