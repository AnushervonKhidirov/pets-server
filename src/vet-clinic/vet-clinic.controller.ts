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
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { VetClinicService } from './vet-clinic.service';

import { CreateVetClinicDto } from './dto/create-vet-clinic.dto';
import { UpdateVetClinicDto } from './dto/update-vet-clinic.dto';

const vetClinicsExample = [
  {
    id: 1,
    name: 'Городская Ветеринарная Клиника',
    address: 'Кахорова 29',
    latitude: 38.56194293904967,
    longitude: 68.77537965776406,
    contacts: ['+992918972505'],
    about: 'Ветеринарная клиника в подвале здания',
    image: null,
  },
  {
    id: 2,
    name: '4 Лапы',
    address: 'Бехзод 47',
    latitude: 38.57368522247546,
    longitude: 68.8012973175865,
    contacts: ['+992918900039'],
    about:
      'Ветеринарная клиника внутри магазина 4 лапы. Подвал супермаркета Ашан (bi1)',
    image: null,
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
    });

    console.log(err);

    if (err) throw err;
    return vetClinic;
  }

  @ApiResponse({ example: vetClinicsExample })
  @Get()
  async findMany() {
    const [vetClinic, err] = await this.vetClinicService.findMany();
    if (err) throw err;
    return vetClinic;
  }

  @ApiResponse({ example: vetClinicsExample[0] })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateVetClinicDto,
  ) {
    const [vetClinic, err] = await this.vetClinicService.create({ data });
    if (err) throw err;
    return vetClinic;
  }

  @ApiResponse({ example: vetClinicsExample[0] })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateVetClinicDto,
  ) {
    const [vetClinic, err] = await this.vetClinicService.update({
      where: { id },
      data,
    });
    if (err) throw err;
    return vetClinic;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [, err] = await this.vetClinicService.delete({
      where: { id },
    });
    if (err) throw err;
  }
}
