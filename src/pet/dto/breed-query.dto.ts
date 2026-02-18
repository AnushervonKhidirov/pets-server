import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BreedQueryDto {
  @ApiProperty({ example: 1, name: 'petTypeId', required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  petTypeId?: number;
}
