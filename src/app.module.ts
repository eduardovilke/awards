import { Module } from '@nestjs/common';
import { NomineesModule } from './modules/nominees/nominees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [path.resolve(__dirname, 'modules', '**', '*.entity.{t,j}s')],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    NomineesModule,
  ],
})
export class AppModule {}
