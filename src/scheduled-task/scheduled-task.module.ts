import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';
import { ResetPasswordModule } from 'src/reset-password/reset-password.module';
import { ScheduledTaskService } from './scheduled-task.service';

@Module({
  imports: [TokenModule, VerificationCodeModule, ResetPasswordModule],
  providers: [ScheduledTaskService],
})
export class ScheduledTaskModule {}
