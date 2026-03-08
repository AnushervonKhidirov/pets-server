import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';
import { ScheduledTaskService } from './scheduled-task.service';

@Module({
  imports: [TokenModule, VerificationCodeModule],
  providers: [ScheduledTaskService],
})
export class ScheduledTaskModule {}
