import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

import tokenConfig from './token.config';

@Module({
  imports: [ConfigModule.forFeature(tokenConfig), PrismaModule, JwtModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
