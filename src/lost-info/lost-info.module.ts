import { Module } from '@nestjs/common';
import { LostInfoService } from './lost-info.service';
import { LostInfoController } from './lost-info.controller';

@Module({
  providers: [LostInfoService],
  controllers: [LostInfoController]
})
export class LostInfoModule {}
