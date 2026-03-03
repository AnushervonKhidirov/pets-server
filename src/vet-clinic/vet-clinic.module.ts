import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { VetClinicController } from './vet-clinic.controller';
import { VetClinicService } from './vet-clinic.service';

@Module({
  imports: [PrismaModule],
  controllers: [VetClinicController],
  providers: [VetClinicService],
})
export class VetClinicModule {}
