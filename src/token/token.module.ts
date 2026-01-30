import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
