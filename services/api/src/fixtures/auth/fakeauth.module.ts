import { IdentifyModule } from '@app/auth/identity/identify.module';
import { DataModule } from '@data/data.module';
import { Module } from '@nestjs/common';
import { FakeAuthGuard } from './FakeAuth';

@Module({
  imports: [DataModule, IdentifyModule],
  providers: [FakeAuthGuard],
  exports: [FakeAuthGuard],
})
export class FakeAuthModule {}
