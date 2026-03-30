import { IsInt, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryBreedDto {
  @ApiProperty({ example: 1, name: 'petTypeId', required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  petTypeId?: number;
}

export class SearchQueryBreedDto {
  @ApiProperty({ example: 1, name: 'petTypeId', required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  petTypeId?: number;

  @ApiProperty({ example: 'Abyssinian', required: false })
  @IsString()
  @IsOptional()
  en?: string;

  @ApiProperty({ example: 'Абиссинская', required: false })
  @IsString()
  @IsOptional()
  ru?: string;

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
