import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TokenService } from 'src/token/token.service';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';
import { ResetPasswordService } from 'src/reset-password/reset-password.service';

@Injectable()
export class ScheduledTaskService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens() {
    await this.tokenService.deleteExpired();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredCodes() {
    await this.verificationCodeService.deleteExpired();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteResetPasswordId() {
    await this.resetPasswordService.deleteExpired();
  }
}
