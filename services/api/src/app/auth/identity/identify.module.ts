import { DataModule } from '@data/data.module';
import { CacheModule, Module } from '@nestjs/common';
import { IdentifyService } from './identify.service';

@Module({
  imports: [DataModule, CacheModule.register({ isGlobal: true })],
  providers: [IdentifyService],
  exports: [IdentifyService],
})
export class IdentifyModule {}
