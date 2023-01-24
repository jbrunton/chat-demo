import { AppModule } from '@app/app.module';
import { DataModule } from '@data/data.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DataModule, AppModule],
})
export class MainModule {}
