import { Sex } from 'prisma/generated/prisma/enums';

import { IsEnum, IsString, IsInt, IsDate, IsOptional } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ApiSchema({ name: 'Create Pet Dto' })
export class CreatePetDto {
  @ApiProperty({ example: 'Phobos' })
  @IsString()
  name: string;

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
  @Type(() => Date)
  birthday?: Date;

  @ApiProperty({ example: '0041231235534234', required: false })
  @IsString()
  @IsOptional()
  microchipId?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  petTypeId: number;

  @ApiProperty({ example: 3, required: false })
  @IsInt()
  @IsOptional()
  breedId?: number;

  @ApiProperty({ example: 'Хитрожопая скотина', required: false })
  @IsString()
  @IsOptional()
  about?: string;
}
