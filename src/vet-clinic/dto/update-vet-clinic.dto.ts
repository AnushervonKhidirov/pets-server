import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateVetClinicDto } from './create-vet-clinic.dto';

@ApiSchema({ name: 'Update Vet Clinic Dto' })
export class UpdateVetClinicDto extends PartialType(CreateVetClinicDto) {}
