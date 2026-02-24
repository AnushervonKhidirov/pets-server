import { ApiSchema, PartialType, OmitType } from '@nestjs/swagger';
import { CreateLostInfoDto } from './create-lost-info.dto';

@ApiSchema({ name: 'Update Lost Info DTO' })
export class UpdateLostInfoDto extends PartialType(
  OmitType(CreateLostInfoDto, ['petId']),
) {}
