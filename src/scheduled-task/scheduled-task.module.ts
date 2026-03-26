import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';
import { PasswordModule } from 'src/reset-password/password.module';
import { DatabaseModule } from 'src/database/database.module';

import { ScheduledTaskService } from './scheduled-task.service';

@Module({
  imports: [
    TokenModule,
    VerificationCodeModule,
    PasswordModule,
    DatabaseModule,
  ],
  providers: [ScheduledTaskService],
})
export class ScheduledTaskModule {}
