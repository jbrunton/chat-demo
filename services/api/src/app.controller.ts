import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserInfo } from './user-profile/user-info';
import { FetchUserInfo } from './user-profile/feat-user-info.decorator';
import { Auth } from './auth/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealthCheck(): string {
    return 'OK';
  }

  @Get('greeting')
  getGreeting(): string {
    return this.appService.getGreeting();
  }

  @Get('private-greeting')
  @Auth()
  getPrivateGreeting(@FetchUserInfo() user: UserInfo): string {
    return this.appService.getGreeting(user.name);
  }

  @Post('custom-greeting')
  @Auth('write:greetings')
  setGreeting(
    @Body('greeting') greeting: string,
    @FetchUserInfo() user: UserInfo,
  ): string {
    return this.appService.getCustomGreeting(greeting, user.name);
  }
}
