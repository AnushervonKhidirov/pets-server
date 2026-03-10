import { ApiSchema, PickType } from '@nestjs/swagger';
import { ResetPasswordDto } from './reset-password.dto';

@ApiSchema({ name: 'Check password url DTO' })
export class CheckPasswordUrlDto extends PickType(ResetPasswordDto, [
  'pageId',
]) {}
