import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './controller/auth.controller';
import { OAuthGoogleController } from './controller/oauth-google.controller';

import { AuthService } from './service/auth.service';
import { OAuthGoogleService } from './service/oauth-google.service';

import oauthGoogleConfig from './config/oauth-google.config';

@Module({
  imports: [
    ConfigModule.forFeature(oauthGoogleConfig),
    JwtModule,
    PrismaModule,
    MailerModule,
    TokenModule,
    UserModule,
  ],
  controllers: [AuthController, OAuthGoogleController],
  providers: [AuthService, OAuthGoogleService],
})
export class AuthModule {}
