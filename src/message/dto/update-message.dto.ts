import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

@ApiSchema({ name: 'Update Message Dto' })
export class UpdateMessageDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  watched: boolean;
}
