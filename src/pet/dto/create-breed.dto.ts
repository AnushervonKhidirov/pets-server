import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ApiSchema({ name: 'Create Breed DTO' })
export class CreateBreedDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  petTypeId: number;

  @ApiProperty({ example: 'Maine Coon' })
  @IsString()
  en: string;

  @ApiProperty({ example: 'Мейн-кун' })
  @IsString()
  ru: string;
}

@ApiSchema({ name: 'Create Many Breed DTO' })
export class CreateManyBreedDto {
  @ApiProperty({
    example: [
      { petTypeId: 1, en: 'Maine Coon', ru: 'Мейн-кун' },
      {
        petTypeId: 1,
        en: 'Scottish Fold',
        ru: 'Шотландская вислоухая',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateBreedDto)
  breeds: CreateBreedDto[];
}
