import { Controller, Get, Post, Body, Param, Sse } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, SentMessageDto } from './dto/messages';
import { Auth } from '@app/auth/auth.decorator';
import { Identify } from '@app/auth/auth0/identify.decorator';
import { User } from '@entities/users/user.entity';
import { Dispatcher } from '@entities/messages/message';
import { GetMessagesUseCase } from '@usecases/messages/get-messages';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Auth()
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly getMessages: GetMessagesUseCase,
    private readonly dispatcher: Dispatcher,
  ) {}

  @Post('/')
  @ApiOperation({
    summary: 'Send a message to a room from the authenticated user',
  })
  saveMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Identify() user: User,
  ) {
    return this.messagesService.handleMessage(createMessageDto, user);
  }

  @Get('/:roomId')
  @ApiOperation({ summary: 'Get all messages for the room' })
  @ApiResponse({
    status: 200,
    description: 'The messages for the room',
    type: [SentMessageDto],
  })
  get(@Param('roomId') roomId: string, @Identify() user: User) {
    return this.getMessages.exec(roomId, user);
  }

  @Sse('/:roomId/subscribe')
  @ApiOperation({ summary: 'subscribe to messages for the room' })
  subscribeMessages(@Param('roomId') roomId: string, @Identify() user: User) {
    return this.dispatcher.subscribe(roomId, user);
  }
}
