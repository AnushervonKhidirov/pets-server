import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreatePetTypeDto } from './create-pet-type.dto';

@ApiSchema({ name: 'Update Pet Type DTO' })
export class UpdatePetTypeDto extends PartialType(CreatePetTypeDto) {}
