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
import { BreedService } from '../service/breed.service';
import { ApiResponse } from '@nestjs/swagger';

import { CreateBreedDto, CreateManyBreedDto } from '../dto/create-breed.dto';
import { UpdateBreedDto } from '../dto/update-breed.dto';

const breedExample = [
  { petTypeId: 1, en: 'Maine Coon', ru: 'Мейн-кун' },
  {
    petTypeId: 1,
    en: 'Scottish Fold',
    ru: 'Скоттиш фолд (Шотландская вислоухая)',
  },
];

@Controller('pet/breed')
export class BreedController {
  constructor(private readonly breedService: BreedService) {}

  @ApiResponse({ example: breedExample[0] })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [breed, err] = await this.breedService.findOne({ where: { id } });
    if (err) throw err;
    return breed;
  }

  @ApiResponse({ example: breedExample })
  @Get()
  async findMany() {
    const [breeds, err] = await this.breedService.findMany();
    if (err) throw err;
    return breeds;
  }

  @ApiResponse({ example: { count: breedExample.length } })
  @Post('many')
  async createMany(
    @Body(new ValidationPipe({ whitelist: true })) data: CreateManyBreedDto,
  ) {
    const [breed, err] = await this.breedService.createMany({
      data: data.breeds,
    });
    if (err) throw err;
    return breed;
  }

  @ApiResponse({ example: breedExample[0] })
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true })) data: CreateBreedDto,
  ) {
    const [breed, err] = await this.breedService.create({ data });
    if (err) throw err;
    return breed;
  }

  @ApiResponse({ example: breedExample[0] })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) data: UpdateBreedDto,
  ) {
    const [breed, err] = await this.breedService.update({
      where: { id },
      data,
    });
    if (err) throw err;
    return breed;
  }

  @ApiResponse({ example: breedExample[0] })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [breed, err] = await this.breedService.delete({ where: { id } });
    if (err) throw err;
    return breed;
  }
}
