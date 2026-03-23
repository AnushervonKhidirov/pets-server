import { IsString, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ApiSchema({ name: 'Create Country DTO' })
export class CreateCountryDto {
  @ApiProperty({ example: 'Tajikistan' })
  @IsString()
  @IsNotEmpty()
  en: string;

  @ApiProperty({ example: 'Таджикистан' })
  @IsString()
  @IsNotEmpty()
  ru: string;
}

@ApiSchema({ name: 'Create Many Country DTO' })
export class CreateManyCountryDto {
  @ApiProperty({
    example: [
      { en: 'Tajikistan', ru: 'Таджикистан' },
      {
        en: 'Russia',
        ru: 'Россия',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCountryDto)
  countries: CreateCountryDto[];
}
