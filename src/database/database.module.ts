import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from 'src/token/token.module';

import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

import prismaConfig from 'src/prisma/prisma.config';

@Module({
  imports: [ConfigModule.forFeature(prismaConfig), TokenModule],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [DatabaseService],
})
export class DatabaseModule {}
