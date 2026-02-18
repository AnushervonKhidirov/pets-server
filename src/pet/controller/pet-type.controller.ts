import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { PetTypeService } from '../service/pet-type.service';
import { ApiResponse } from '@nestjs/swagger';

import {
  CreateManyPetTypeDto,
  CreatePetTypeDto,
} from '../dto/create-pet-type.dto';
import { UpdatePetTypeDto } from '../dto/update-pet-type.dto';

const petTypeExample = [
  { id: 1, en: 'Cat', ru: 'Кошка' },
  { id: 2, en: 'Dog', ru: 'Собака' },
];

@Controller('pet-type')
export class PetTypeController {
  constructor(private readonly petTypeService: PetTypeService) {}

  @ApiResponse({ example: petTypeExample[0] })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [petType, err] = await this.petTypeService.findOne({ where: { id } });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petTypeExample })
  @Get()
  async findMany() {
    const [petTypes, err] = await this.petTypeService.findMany();
    if (err) throw err;
    return petTypes;
  }

  @ApiResponse({ example: { count: petTypeExample.length } })
  @Post('many')
  async createMany(
    @Body(new ValidationPipe({ whitelist: true })) data: CreateManyPetTypeDto,
  ) {
    const [petType, err] = await this.petTypeService.createMany({
      data: data.petTypes,
    });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petTypeExample[0] })
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true })) data: CreatePetTypeDto,
  ) {
    const [petType, err] = await this.petTypeService.create({ data: data });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petTypeExample[0] })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) data: UpdatePetTypeDto,
  ) {
    const [petType, err] = await this.petTypeService.update({
      where: { id },
      data,
    });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petTypeExample[0] })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [petType, err] = await this.petTypeService.delete({ where: { id } });
    if (err) throw err;
    return petType;
  }
}
