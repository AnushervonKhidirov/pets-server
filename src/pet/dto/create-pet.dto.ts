import { Sex } from 'prisma/generated/prisma/enums';

import {
  IsEnum,
  IsString,
  IsInt,
  IsDate,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @ApiProperty({ example: 'Phobos' })
  @IsString()
  name: string;

  @ApiProperty({ example: Sex.Male })
  @IsEnum(Sex)
  @IsOptional()
  sex?: Sex;

  @ApiProperty({ example: new Date('06/14/2023').toDateString() })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthday?: Date;

  @ApiProperty({ example: '0041231235534234' })
  @IsString()
  @IsOptional()
  microchipId?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  petTypeId: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsOptional()
  breedId?: number;

  @ApiProperty({ example: 'Хитрожопая скотина' })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  lost?: boolean;

  @ApiProperty({ example: new Date('11/1/2025').toDateString() })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lostAt?: Date;
}
