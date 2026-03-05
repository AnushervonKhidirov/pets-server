import { Reflector } from '@nestjs/core';
import { Role } from 'prisma/generated/prisma/enums';

export const Roles = Reflector.createDecorator<Role[]>();
