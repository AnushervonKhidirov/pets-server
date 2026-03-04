import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  watched: boolean;
}
