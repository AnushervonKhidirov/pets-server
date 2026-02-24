import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { PetModule } from 'src/pet/pet.module';

import { LostInfoService } from './lost-info.service';
import { LostInfoController } from './lost-info.controller';

@Module({
  imports: [PrismaModule, TokenModule, PetModule],
  providers: [LostInfoService],
  controllers: [LostInfoController],
})
export class LostInfoModule {}
