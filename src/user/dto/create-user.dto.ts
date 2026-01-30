import { IsPhoneNumber, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Create user DTO' })
export class CreateUserDto {
  @ApiProperty({ example: '+992771320843' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'FirstName' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'LastName', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'your_password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'your_email@gmail.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}
