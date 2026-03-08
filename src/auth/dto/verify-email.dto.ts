import { IsEmail } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Verify Email DTO' })
export class VerifyEmailDto {
  @ApiProperty({ example: 'your_email@gmail.com' })
  @IsEmail()
  email: string;
}
