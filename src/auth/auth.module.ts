import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, TokenModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
