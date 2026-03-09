import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Change password DTO' })
export class ChangePasswordDto {
  @ApiProperty({ example: 'your_old_password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'your_new_password' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
