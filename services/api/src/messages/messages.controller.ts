import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Auth } from '../auth/auth.decorator';
import { Identify } from '../auth/user-profile/identify.decorator';
import { UserInfo } from '../auth/user-profile/user-info';
import { User } from './entities/user.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Auth()
  @Post()
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Identify() profile: UserInfo,
  ) {
    const user: User = {
      id: profile.sub,
      name: profile.name || 'anon',
      picture: profile.picture || '',
    };
    return this.messagesService.create(createMessageDto, user);
  }

  @Auth()
  @Get('/:roomId')
  getMessages(@Param('roomId') roomId: string) {
    return this.messagesService.findForRoom(roomId);
  }
}
