import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Reset password DTO' })
export class ResetPasswordDto {
  @ApiProperty({ example: '2e4e7c73-cbde-4100-b3ad-2ec6422690d2' })
  @IsUUID('4')
  @IsNotEmpty()
  pageId: string;

  @ApiProperty({ example: 'your_new_password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
