import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateBreedDto } from './create-breed.dto';

@ApiSchema({ name: 'Update Breed DTO' })
export class UpdateBreedDto extends PartialType(CreateBreedDto) {}
