import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';

import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
