import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getGreeting(name?: string): string {
    return `Hello, ${name ?? 'World'}!`;
  }
}
