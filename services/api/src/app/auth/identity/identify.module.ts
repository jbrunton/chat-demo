import { DataModule } from '@data/data.module';
import { Module } from '@nestjs/common';
import { IdentifyService } from './identify.service';

@Module({
  imports: [DataModule],
  providers: [IdentifyService],
  exports: [IdentifyService],
})
export class IdentifyModule {}
