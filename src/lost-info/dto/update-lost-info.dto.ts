import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateLostInfoDto } from './create-lost-info.dto';

@ApiSchema({ name: 'Update Lost Info DTO' })
export class UpdateLostInfoDto extends PartialType(CreateLostInfoDto) {}
