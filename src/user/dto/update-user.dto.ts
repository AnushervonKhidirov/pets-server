import type { NullableJsonNullValueInput } from 'prisma/generated/prisma/internal/prismaNamespace';

import {
  IsPhoneNumber,
  IsString,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiSchema, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import parsePhoneNumberFromString from 'libphonenumber-js';

import { CreateUserDto } from './create-user.dto';

@ApiSchema({ name: 'Address Dto' })
export class AddressDto {
  @ApiProperty({ example: 'some address, appartment number', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 40.4123124123, required: false })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 90.4123124123, required: false })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;
}

@ApiSchema({ name: 'Update user DTO' })
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: '+992715303256', required: false })
  @IsPhoneNumber('TJ')
  @Transform(({ obj }: { obj: { phone: string | null } }) => {
    if (!obj.phone) return obj.phone;
    if ('phone' in obj) {
      const formattedNumber = parsePhoneNumberFromString(
        obj.phone,
        'TJ',
      )?.number.toString();

      obj.phone = formattedNumber ?? obj.phone;
      return obj.phone;
    }
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: [
      { name: 'Telegram', value: 'username' },
      { name: 'WatsApp', value: 'username' },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  contacts?: NullableJsonNullValueInput;

  @ApiProperty({
    example: {
      address: 'some address, appartment number',
      latitude: 40.4123124123,
      longitude: 90.4123124123,
    },
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;
}
