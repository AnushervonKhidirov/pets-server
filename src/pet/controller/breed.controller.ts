import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

import { BreedService } from '../service/breed.service';

import { CreateBreedDto, CreateManyBreedDto } from '../dto/create-breed.dto';
import { UpdateBreedDto } from '../dto/update-breed.dto';
import { BreedQueryDto } from '../dto/breed-query.dto';

const breedExample = [
  { petTypeId: 1, en: 'Maine Coon', ru: 'Мейн-кун' },
  {
    petTypeId: 1,
    en: 'Scottish Fold',
    ru: 'Шотландская вислоухая',
  },
];

@Controller('pet-breed')
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
  async findMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    where: BreedQueryDto,
  ) {
    const [breeds, err] = await this.breedService.findMany({ where });
    if (err) throw err;
    return breeds;
  }

  @ApiResponse({ example: { count: breedExample.length } })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true })) data: CreateBreedDto,
  ) {
    const [breed, err] = await this.breedService.create({ data });
    if (err) throw err;
    return breed;
  }

  @ApiResponse({ example: breedExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [breed, err] = await this.breedService.delete({ where: { id } });
    if (err) throw err;
    return breed;
  }
}
