import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateCityDto } from './create-city.dto';

@ApiSchema({ name: 'Update City DTO' })
export class UpdateCityDto extends PartialType(CreateCityDto) {}
