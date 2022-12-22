import { Controller, createParamDecorator, ExecutionContext, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { UserInfo } from './user-profile/user-info';
import { FetchUserInfo } from './user-profile/feat-user-info.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('greeting')
  getGreeting(): string {
    return this.appService.getGreeting();
  }

  @Get('private-greeting')
  @UseGuards(AuthGuard('jwt'))
  getPrivateGreeting(@FetchUserInfo() profile: UserInfo): string {
    return this.appService.getGreeting(profile.name);
  }
}
