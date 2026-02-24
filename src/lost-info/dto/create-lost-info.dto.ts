import { IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ApiSchema({ name: 'Create Lost Info DTO' })
export class CreateLostInfoDto {
  @ApiProperty({ example: 'lost details', required: false })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({ example: 'some address', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: new Date('11/1/2025').toDateString() })
  @IsDate()
  @Type(() => Date)
  lostAt: Date;
}
