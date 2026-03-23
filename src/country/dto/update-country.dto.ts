import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateCountryDto } from './create-country.dto';

@ApiSchema({ name: 'Update Country DTO' })
export class UpdateCountryDto extends PartialType(CreateCountryDto) {}
