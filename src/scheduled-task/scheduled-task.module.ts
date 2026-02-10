import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { ScheduledTaskService } from './scheduled-task.service';

@Module({
  imports: [TokenModule],
  providers: [ScheduledTaskService],
})
export class ScheduledTaskModule {}
