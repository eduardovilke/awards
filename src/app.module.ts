import { Module } from '@nestjs/common';
import { NomineesModule } from './modules/nominees/nominees.module';

@Module({
  imports: [NomineesModule],
})
export class AppModule {}
