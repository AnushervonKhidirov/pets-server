import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Create user DTO' })
export class CreateUserDto {
  @ApiProperty({ example: 'your_email@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'your_password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'FirstName' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'LastName', required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;
}
