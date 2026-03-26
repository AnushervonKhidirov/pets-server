import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { StorageModule } from './storage/storage.module';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './token/token.module';
import { ScheduledTaskModule } from './scheduled-task/scheduled-task.module';
import { MailerModule } from './mailer/mailer.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import { PasswordModule } from './reset-password/password.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import { LostInfoModule } from './lost-info/lost-info.module';
import { VetClinicModule } from './vet-clinic/vet-clinic.module';
import { MessageModule } from './message/message.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { StatisticModule } from './statistic/statistic.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    StorageModule,
    PrismaModule,
    TokenModule,
    ScheduledTaskModule,
    MailerModule,
    VerificationCodeModule,
    PasswordModule,
    AuthModule,
    UserModule,
    PetModule,
    LostInfoModule,
    VetClinicModule,
    MessageModule,
    CountryModule,
    CityModule,
    StatisticModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
