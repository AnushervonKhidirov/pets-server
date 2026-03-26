import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TokenService } from 'src/token/token.service';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';
import { PasswordService } from 'src/reset-password/password.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ScheduledTaskService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly passwordService: PasswordService,
    private readonly databaseService: DatabaseService,
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
  async deleteResetPasswordPageId() {
    await this.passwordService.deleteExpiredResetPageId();
  }

  @Cron(CronExpression.EVERY_WEEK)
  async createDatabaseBackup() {
    await this.databaseService.backup();
  }
}
