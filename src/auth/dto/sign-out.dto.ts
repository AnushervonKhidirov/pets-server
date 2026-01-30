import { IsString } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Sign out DTO' })
export class SignOutDto {
  @ApiProperty({ example: 'your.refresh.token' })
  @IsString()
  refreshToken: string;
}
