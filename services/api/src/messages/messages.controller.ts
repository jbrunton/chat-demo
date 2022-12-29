import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Auth } from '../auth/auth.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Auth()
  @Post()
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Auth()
  @Get('/:roomId')
  getMessages(@Param('roomId') roomId: string) {
    return this.messagesService.findForRoom(roomId);
  }
}
