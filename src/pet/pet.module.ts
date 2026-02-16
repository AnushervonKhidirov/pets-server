import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { PetService } from './service/pet.service';
import { PetTypeService } from './service/pet-type.service';
import { BreedService } from './service/breed.service';

import { PetController } from './controller/pet.controller';
import { PetTypeController } from './controller/pet-type.controller';
import { BreedController } from './controller/breed.controller';

@Module({
  imports: [PrismaModule],
  providers: [PetService, PetTypeService, BreedService],
  controllers: [PetController, PetTypeController, BreedController],
})
export class PetModule {}
