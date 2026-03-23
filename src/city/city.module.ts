import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';

import { CityController } from './city.controller';
import { CityService } from './city.service';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
