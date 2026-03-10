import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';

@Module({
  imports: [PrismaModule, MailerModule],
  providers: [PasswordService],
  controllers: [PasswordController],
  exports: [PasswordService],
})
export class PasswordModule {}
