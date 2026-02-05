import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { OAuthGoogleService } from './oauth-services/oauth-google.service';

import oauthGoogleConfig from './config/oauth-google.config';

@Module({
  imports: [
    ConfigModule.forFeature(oauthGoogleConfig),
    JwtModule,
    PrismaModule,
    TokenModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OAuthGoogleService],
})
export class AuthModule {}
