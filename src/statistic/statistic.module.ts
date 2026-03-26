import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';

@Module({
  imports: [PrismaModule],
  providers: [StatisticService],
  controllers: [StatisticController],
})
export class StatisticModule {}
