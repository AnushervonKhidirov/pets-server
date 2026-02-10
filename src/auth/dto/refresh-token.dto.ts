import { IsString } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Refresh token DTO' })
export class RefreshTokenDto {
  @ApiProperty({ example: 'your.refresh.token' })
  @IsString()
  refreshToken: string;
}
