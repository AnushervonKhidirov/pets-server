import {
  IsString,
  IsInt,
  IsNumber,
  IsPhoneNumber,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import parsePhoneNumberFromString from 'libphonenumber-js';

@ApiSchema({ name: 'Create Vet Clinic Dto' })
export class CreateVetClinicDto {
  @IsString()
  @ApiProperty({ example: 'vet clinic name' })
  nameEn: string;

  @IsString()
  @ApiProperty({ example: 'vet clinic name' })
  nameRu: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  countryId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  cityId: number;

  @IsString()
  @ApiProperty({ example: 'vet clinic address' })
  addressEn: string;

  @IsString()
  @ApiProperty({ example: 'vet clinic address' })
  addressRu: string;

  @IsNumber()
  @ApiProperty({ example: 40.4123124123 })
  latitude: number;

  @IsNumber()
  @ApiProperty({ example: 90.4123124123 })
  longitude: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsPhoneNumber('TJ', { each: true })
  @ApiProperty({ example: ['+992715303256'] })
  @Transform(({ value }: { value: string[] }) => {
    return value.map((phone) => {
      const formattedNumber = parsePhoneNumberFromString(
        phone,
        'TJ',
      )?.number.toString();

      return formattedNumber ?? phone;
    });
  })
  contacts: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'about vet clinic', required: false })
  about?: string;
}
