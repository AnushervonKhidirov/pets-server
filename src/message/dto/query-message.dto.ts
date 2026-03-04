import {
  IsString,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import parsePhoneNumberFromString from 'libphonenumber-js';

export class QueryMessageDto {
  @ApiProperty({ example: 'Сообщить об ошибке', required: false })
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiProperty({ example: '+992715303256', required: false })
  @IsPhoneNumber('TJ')
  @IsOptional()
  @Transform(({ value }: { value: string | null }) => {
    if (!value) return value;

    const formattedNumber = parsePhoneNumberFromString(
      value,
      'TJ',
    )?.number.toString();

    value = formattedNumber ?? value;
    return value;
  })
  phone?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  watched?: boolean;
}
