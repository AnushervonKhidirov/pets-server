import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';

import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';

@Module({
  imports: [PrismaModule, MailerModule],
  providers: [ScanService],
  controllers: [ScanController],
})
export class ScanModule {}
