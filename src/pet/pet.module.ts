import { Module } from '@nestjs/common';
import { StorageModule } from 'src/storage/storage.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';

import { PetService } from './service/pet.service';
import { PetTypeService } from './service/pet-type.service';
import { BreedService } from './service/breed.service';

import { PetController } from './controller/pet.controller';
import { PetTypeController } from './controller/pet-type.controller';
import { BreedController } from './controller/breed.controller';

@Module({
  imports: [StorageModule, PrismaModule, TokenModule],
  providers: [PetService, PetTypeService, BreedService],
  controllers: [PetController, PetTypeController, BreedController],
  exports: [PetService],
})
export class PetModule {}
