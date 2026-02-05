import type { ConfigType } from '@nestjs/config';

import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'prisma/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import prismaConfig from './prisma.config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    @Inject(prismaConfig.KEY)
    readonly config: ConfigType<typeof prismaConfig>,
  ) {
    const adapter = new PrismaMariaDb(config);
    super({ adapter });
  }
}
