import {
  IsString,
  IsInt,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import parsePhoneNumberFromString from 'libphonenumber-js';

export class QueryUserDto {
  @ApiProperty({ example: 'your_email@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'firstName', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'lastName', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: '+992715303256', required: false })
  @IsPhoneNumber('TJ')
  @Transform(({ value }: { value: string | null }) => {
    if (!value) return value;

    const formattedNumber = parsePhoneNumberFromString(
      value,
      'TJ',
    )?.number.toString();

    value = formattedNumber ?? value;
    return value;
  })
  @IsOptional()
  phone?: string;
}

export class SearchQueryUserDto {
  @ApiProperty({ example: 'your_email@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'firstName', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'lastName', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: '+992715303256', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 50, required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @ApiProperty({ example: 10, required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  take?: number;
}
