import { IsEmail, IsString } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Sign in DTO' })
export class SignInDto {
  @ApiProperty({ example: 'your_email@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'your_password' })
  @IsString()
  password: string;
}
