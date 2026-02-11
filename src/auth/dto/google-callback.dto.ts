import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@ApiSchema({ name: 'Google Callback DTO' })
export class GoogleCallbackDto {
  @ApiProperty({ example: 'somecodeprovidedbygoogleoauth' })
  @IsString()
  code: string;
}
