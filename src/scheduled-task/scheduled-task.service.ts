import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class ScheduledTaskService {
  constructor(private readonly tokenService: TokenService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens() {
    await this.tokenService.deleteExpiredTokens();
  }
}
