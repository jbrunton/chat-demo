import { Controller, Get, Post, Body, Param, Sse } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Auth } from '@app/auth/auth.decorator';
import { Identify } from '@app/auth/auth0/identify.decorator';
import { User } from '@entities/user.entity';
import { Dispatcher } from '@entities/messages';
import { GetMessagesUseCase } from '@usecases/messages/get-messages';

@Auth()
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly getMessages: GetMessagesUseCase,
    private readonly dispatcher: Dispatcher,
  ) {}

  @Post('/')
  saveMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Identify() user: User,
  ) {
    return this.messagesService.handleMessage(createMessageDto, user);
  }

  @Get('/:roomId')
  get(@Param('roomId') roomId: string, @Identify() user: User) {
    return this.getMessages.exec(roomId, user);
  }

  @Sse('/:roomId/subscribe')
  subscribeMessages(@Param('roomId') roomId: string, @Identify() user: User) {
    return this.dispatcher.subscribe(roomId, user);
  }
}
