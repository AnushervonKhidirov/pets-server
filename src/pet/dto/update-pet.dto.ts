import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreatePetDto } from './create-pet.dto';

@ApiSchema({ name: 'Update Pet Dto' })
export class UpdatePetDto extends PartialType(CreatePetDto, {
  skipNullProperties: false,
}) {}
