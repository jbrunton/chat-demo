import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Auth } from '@lib/auth/auth.decorator';
import { Identify } from '@lib/auth/user-profile/identify.decorator';
import { UserInfo } from '@lib/auth/user-profile/user-info';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Auth()
  @Post()
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Identify() info: UserInfo,
  ) {
    return this.messagesService.create(createMessageDto, info);
  }

  @Auth()
  @Get('/:roomId')
  getMessages(@Param('roomId') roomId: string) {
    return this.messagesService.findForRoom(roomId);
  }
}
