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
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

import { PetTypeService } from '../service/pet-type.service';

import {
  CreateManyPetTypeDto,
  CreatePetTypeDto,
} from '../dto/create-pet-type.dto';
import { UpdatePetTypeDto } from '../dto/update-pet-type.dto';
import { SearchQueryPetTypeDto } from '../dto/query-pet-type.dto';

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

  @ApiResponse({
    example: { data: petTypeExample, total: petTypeExample.length },
  })
  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: SearchQueryPetTypeDto,
  ) {
    const { skip, take, ...whereQuery } = query;

    const where = {
      en: { contains: whereQuery.en },
      ru: { contains: whereQuery.ru },
    };

    const [data, err] = await this.petTypeService.findMany({
      where,
      skip,
      take,
    });
    if (err) throw err;

    const [total, countErr] = await this.petTypeService.count({ where });
    if (countErr) throw countErr;

    return { data, total };
  }

  @ApiResponse({ example: { count: petTypeExample.length } })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true })) data: CreatePetTypeDto,
  ) {
    const [petType, err] = await this.petTypeService.create({ data: data });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petTypeExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [petType, err] = await this.petTypeService.delete({ where: { id } });
    if (err) throw err;
    return petType;
  }
}
