import { PartialType } from '@nestjs/swagger';
import { CreateLostInfoDto } from './create-lost-info.dto';

export class UpdateLostInfoDto extends PartialType(CreateLostInfoDto) {}
