import { CacheModule, Module } from '@nestjs/common';
import { IdentifyService } from './identify.service';

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  providers: [IdentifyService],
  exports: [IdentifyService],
})
export class IdentifyModule {}
