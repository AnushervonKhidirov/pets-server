import type { Prisma, VetClinic } from 'prisma/generated/prisma/client';

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

import { VetClinicService } from './vet-clinic.service';

import { CreateVetClinicDto } from './dto/create-vet-clinic.dto';
import { UpdateVetClinicDto } from './dto/update-vet-clinic.dto';

const vetClinicInclude: Prisma.VetClinicInclude = {
  country: { omit: { id: true } },
  city: { omit: { id: true } },
};

const vetClinicsExample: VetClinic[] = [
  {
    id: 1,
    name: { en: 'vet clinic name', ru: 'vet clinic name' },
    address: { en: 'vet clinic address', ru: 'vet clinic address' },
    latitude: 38.56194293904967,
    longitude: 68.77537965776406,
    contacts: ['+992918972505'],
    about: { en: 'about vet clinic', ru: 'about vet clinic' },
    cityId: 1,
    countryId: 1,
  },
  {
    id: 2,
    name: { en: 'vet clinic name', ru: 'vet clinic name' },
    address: { en: 'vet clinic address', ru: 'vet clinic address' },
    latitude: 38.56194293904967,
    longitude: 68.77537965776406,
    contacts: ['+992918972505'],
    about: { en: 'about vet clinic', ru: 'about vet clinic' },
    cityId: 1,
    countryId: 2,
  },
];

@Controller('vet-clinic')
export class VetClinicController {
  constructor(private readonly vetClinicService: VetClinicService) {}

  @ApiResponse({ example: vetClinicsExample[0] })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [vetClinic, err] = await this.vetClinicService.findOne({
      where: { id },
      include: vetClinicInclude,
    });

    if (err) throw err;
    return vetClinic;
  }

  @ApiResponse({
    example: { data: vetClinicsExample, total: vetClinicsExample.length },
  })
  @Get()
  async findMany() {
    const [data, err] = await this.vetClinicService.findMany({
      include: vetClinicInclude,
    });
    if (err) throw err;

    const [total, countErr] = await this.vetClinicService.count();
    if (countErr) throw countErr;

    return { data, total };
  }

  @ApiResponse({ example: vetClinicsExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    { countryId, cityId, ...data }: CreateVetClinicDto,
  ) {
    const [vetClinic, err] = await this.vetClinicService.create({
      data: {
        ...data,
        country: { connect: { id: countryId } },
        city: { connect: { id: cityId } },
      },
      include: vetClinicInclude,
    });
    if (err) throw err;
    return vetClinic;
  }

  @ApiResponse({ example: vetClinicsExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateVetClinicDto,
  ) {
    const [vetClinic, err] = await this.vetClinicService.update({
      where: { id },
      data,
      include: vetClinicInclude,
    });
    if (err) throw err;
    return vetClinic;
  }

  @ApiResponse({ example: vetClinicsExample[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [vetClinic, err] = await this.vetClinicService.delete({
      where: { id },
    });
    if (err) throw err;
    return vetClinic;
  }
}
