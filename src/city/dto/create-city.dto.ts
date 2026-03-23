import {
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ApiSchema({ name: 'Create City DTO' })
export class CreateCityDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  countryId: number;

  @ApiProperty({ example: 'Dushanbe' })
  @IsString()
  @IsNotEmpty()
  en: string;

  @ApiProperty({ example: 'Душанбе' })
  @IsString()
  @IsNotEmpty()
  ru: string;
}

@ApiSchema({ name: 'Create Many City DTO' })
export class CreateManyCityDto {
  @ApiProperty({
    example: [
      {
        countryId: 1,
        en: 'Dushanbe',
        ru: 'Душанбе',
      },
      {
        countryId: 2,
        en: 'Moscow',
        ru: 'Москва',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCityDto)
  cities: CreateCityDto[];
}
