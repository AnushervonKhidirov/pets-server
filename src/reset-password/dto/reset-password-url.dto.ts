import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Reset password url DTO' })
export class ResetPasswordUrlDto {
  @ApiProperty({ example: 'your_email@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
