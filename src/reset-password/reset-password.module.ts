import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserModule } from 'src/user/user.module';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';

@Module({
  imports: [PrismaModule, MailerModule, UserModule],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
