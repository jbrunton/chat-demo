import { Module } from '@nestjs/common';
import { DbAdapter } from './db.adapter';

@Module({
  providers: [DbAdapter],
  exports: [DbAdapter],
})
export class DataModule {}
