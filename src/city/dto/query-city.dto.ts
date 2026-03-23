import { IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCityDto {
  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  countryId?: number;

  @ApiProperty({ example: 'Dushanbe', required: false })
  @IsString()
  @IsOptional()
  en?: string;

  @ApiProperty({ example: 'Душанбе', required: false })
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
