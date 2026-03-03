import { PartialType } from '@nestjs/swagger';
import { CreateVetClinicDto } from './create-vet-clinic.dto';

export class UpdateVetClinicDto extends PartialType(CreateVetClinicDto) {}
