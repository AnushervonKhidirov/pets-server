import { Sex } from 'prisma/generated/prisma/enums';

import {
  IsEnum,
  IsString,
  IsUUID,
  IsDate,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPetDto {
  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @ApiProperty({
    example: '2de16ba8-5730-4899-88fa-832422600dc6',
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  uuid?: string;

  @ApiProperty({ example: 'Phobos', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: Sex.Male, required: false })
  @IsEnum(Sex)
  @IsOptional()
  sex?: Sex;

  @ApiProperty({
    example: new Date('06/14/2023').toDateString(),
    required: false,
  })
  @IsDate()
  @IsOptional()
  birthday?: Date;

  @ApiProperty({ example: '0041231235534234', required: false })
  @IsString()
  @IsOptional()
  microchipId?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  petTypeId?: number;

  @ApiProperty({ example: 3, required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  breedId?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  lost?: boolean;

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
