import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';

import { VetClinicController } from './vet-clinic.controller';
import { VetClinicService } from './vet-clinic.service';

@Module({
  imports: [PrismaModule, AuthModule, TokenModule],
  controllers: [VetClinicController],
  providers: [VetClinicService],
})
export class VetClinicModule {}
