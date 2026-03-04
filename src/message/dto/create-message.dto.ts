import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsPhoneNumber } from 'class-validator';
import parsePhoneNumberFromString from 'libphonenumber-js';

@ApiSchema({ name: 'Create Message Dto' })
export class CreateMessageDto {
  @ApiProperty({ example: 'Сообщить об ошибке' })
  @IsString()
  topic: string;

  @ApiProperty({ example: '+992715303256' })
  @IsPhoneNumber('TJ')
  @Transform(({ value }: { value: string | null }) => {
    if (!value) return value;

    const formattedNumber = parsePhoneNumberFromString(
      value,
      'TJ',
    )?.number.toString();

    value = formattedNumber ?? value;
    return value;
  })
  phone: string;

  @ApiProperty({ example: 'У вас тут ошибка' })
  @IsString()
  message: string;
}
