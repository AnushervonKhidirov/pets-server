import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class BreedQueryDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  petTypeId?: number;
}
