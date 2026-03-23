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
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

import { CountryService } from './country.service';

import {
  CreateCountryDto,
  CreateManyCountryDto,
} from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

const countryExample = [
  { id: 1, en: 'Tajikistan', ru: 'Таджикистан' },
  { id: 2, en: 'Russia', ru: 'Россия' },
];

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiResponse({ example: countryExample[0] })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [country, err] = await this.countryService.findOne({ where: { id } });
    if (err) throw err;
    return country;
  }

  @ApiResponse({ example: countryExample })
  @Get()
  async findMany() {
    const [countries, err] = await this.countryService.findMany();
    if (err) throw err;
    return countries;
  }

  @ApiResponse({ example: { count: countryExample.length } })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Post('many')
  async createMany(
    @Body(new ValidationPipe({ whitelist: true })) data: CreateManyCountryDto,
  ) {
    const [batchPayload, err] = await this.countryService.createMany({
      data: data.countries,
    });
    if (err) throw err;
    return batchPayload;
  }

  @ApiResponse({ example: countryExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true })) data: CreateCountryDto,
  ) {
    const [country, err] = await this.countryService.create({ data: data });
    if (err) throw err;
    return country;
  }

  @ApiResponse({ example: countryExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) data: UpdateCountryDto,
  ) {
    const [country, err] = await this.countryService.update({
      where: { id },
      data,
    });
    if (err) throw err;
    return country;
  }

  @ApiResponse({ example: countryExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [country, err] = await this.countryService.delete({ where: { id } });
    if (err) throw err;
    return country;
  }
}
