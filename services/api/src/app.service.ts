import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getGreeting(name?: string): string {
    return `Hello, ${name ?? 'World'}!`;
  }

  getCustomGreeting(greeting: string, name?: string): string {
    return greeting.replace('{0}', name ?? 'World');
  }
}
