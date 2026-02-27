import { Sex } from 'prisma/generated/prisma/enums';

import {
  IsEnum,
  IsString,
  IsDate,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPetDto {
  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  userId?: number;

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
  @IsOptional()
  petTypeId?: number;

  @ApiProperty({ example: 3, required: false })
  @IsInt()
  @IsOptional()
  breedId?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  lost?: boolean;

  @ApiProperty({ example: 50, required: false })
  @IsInt()
  @IsOptional()
  skip?: number;

  @ApiProperty({ example: 10, required: false })
  @IsInt()
  @IsOptional()
  take?: number;
}
