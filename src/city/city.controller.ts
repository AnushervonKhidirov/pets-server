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

import { CityService } from './city.service';

import { CreateCityDto, CreateManyCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { QueryCityDto } from './dto/query-city.dto';

const cityExample = [
  { id: 1, countryId: 1, en: 'Dushanbe', ru: 'Душанбе' },
  { id: 2, countryId: 2, en: 'Moscow', ru: 'Москва' },
];

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiResponse({ example: cityExample[0] })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [city, err] = await this.cityService.findOne({ where: { id } });
    if (err) throw err;
    return city;
  }

  @ApiResponse({ example: { data: cityExample, total: cityExample.length } })
  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryCityDto,
  ) {
    const { skip, take, ...where } = query;

    const [data, err] = await this.cityService.findMany({
      where,
      skip,
      take,
    });

    if (err) throw err;

    const [total, countErr] = await this.cityService.count({ where });
    if (countErr) throw countErr;

    return { data, total };
  }

  @ApiResponse({ example: { count: cityExample.length } })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Post('many')
  async createMany(
    @Body(new ValidationPipe({ whitelist: true })) data: CreateManyCityDto,
  ) {
    const [batchPayload, err] = await this.cityService.createMany({
      data: data.cities,
    });
    if (err) throw err;
    return batchPayload;
  }

  @ApiResponse({ example: cityExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateCityDto,
  ) {
    const [city, err] = await this.cityService.create({
      data: { ...data, country: { connect: { id: data.countryId } } },
    });
    if (err) throw err;
    return city;
  }

  @ApiResponse({ example: cityExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) data: UpdateCityDto,
  ) {
    const [city, err] = await this.cityService.update({
      where: { id },
      data,
    });
    if (err) throw err;
    return city;
  }

  @ApiResponse({ example: cityExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [city, err] = await this.cityService.delete({ where: { id } });
    if (err) throw err;
    return city;
  }
}
