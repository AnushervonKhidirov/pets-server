import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Sign in DTO' })
export class SignInDto {
  @ApiProperty({ example: '+992771320843' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'your_password' })
  @IsString()
  password: string;
}
