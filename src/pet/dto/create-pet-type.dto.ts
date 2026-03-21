import { IsString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ApiSchema({ name: 'Create Pet Type DTO' })
export class CreatePetTypeDto {
  @ApiProperty({ example: 'Cat' })
  @IsString()
  en: string;

  @ApiProperty({ example: 'Кошка' })
  @IsString()
  ru: string;
}

@ApiSchema({ name: 'Create Many Pet Type DTO' })
export class CreateManyPetTypeDto {
  @ApiProperty({
    example: [
      { en: 'Cat', ru: 'Кошка' },
      { en: 'Dog', ru: 'Собака' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePetTypeDto)
  petTypes: CreatePetTypeDto[];
}
