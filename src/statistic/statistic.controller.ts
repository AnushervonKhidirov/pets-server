import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  async getStatistic() {
    const [statistic, err] = await this.statisticService.getStatistic();
    if (err) throw err;
    return statistic;
  }
}
