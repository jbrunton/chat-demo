import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserInfo } from './auth/user-profile/user-info';
import { Identify } from './auth/user-profile/identify.decorator';
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
  getPrivateGreeting(@Identify() user: UserInfo): string {
    return this.appService.getGreeting(user.name);
  }

  @Post('custom-greeting')
  @Auth('write:greetings')
  setGreeting(
    @Body('greeting') greeting: string,
    @Identify() user: UserInfo,
  ): string {
    return this.appService.getCustomGreeting(greeting, user.name);
  }
}
