import { NullableJsonNullValueInput } from 'prisma/generated/prisma/internal/prismaNamespace';

import {
  IsString,
  IsInt,
  IsNumber,
  IsPhoneNumber,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { InputJsonValue, JsonNullClass } from '@prisma/client/runtime/client';

class FieldWithLang {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ru: string;
}

@ApiSchema({ name: 'Create Vet Clinic Dto' })
export class CreateVetClinicDto {
  @ApiProperty({ example: { en: 'vet clinic name', ru: 'vet clinic name' } })
  @ValidateNested()
  @Type(() => FieldWithLang)
  name: JsonNullClass | InputJsonValue;

  @ApiProperty({ example: 1 })
  @IsInt()
  countryId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  cityId: number;

  @ApiProperty({
    example: { en: 'vet clinic address', ru: 'vet clinic address' },
  })
  @ValidateNested()
  @Type(() => FieldWithLang)
  address: JsonNullClass | InputJsonValue;

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

  @ApiProperty({
    example: { en: 'about vet clinic', ru: 'about vet clinic' },
    required: false,
  })
  @ValidateNested()
  @Type(() => FieldWithLang)
  @IsOptional()
  about?: NullableJsonNullValueInput;
}
