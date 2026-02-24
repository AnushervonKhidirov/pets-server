import { IsString, IsDate, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLostInfoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  petId: number;

  @ApiProperty({ example: 'lost details' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({ example: 'some address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: new Date('11/1/2025').toDateString() })
  @IsDate()
  @Type(() => Date)
  lostAt: Date;
}
