import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { StorageModule } from './storage/storage.module';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './token/token.module';
import { ScheduledTaskModule } from './scheduled-task/scheduled-task.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import { LostInfoModule } from './lost-info/lost-info.module';
import { VetClinicModule } from './vet-clinic/vet-clinic.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: getEnv(), isGlobal: true }),
    StorageModule,
    PrismaModule,
    TokenModule,
    ScheduledTaskModule,
    MailerModule,
    AuthModule,
    UserModule,
    PetModule,
    LostInfoModule,
    VetClinicModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

function getEnv(): string {
  const env = process.env.NODE_ENV ?? '';

  const envFileNames: Record<string, string> = {
    development: '.env.development.local',
  };

  return env in envFileNames ? envFileNames[env] : '.env';
}
