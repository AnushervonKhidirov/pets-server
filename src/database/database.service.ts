import type { ConfigType } from '@nestjs/config';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Inject, Injectable } from '@nestjs/common';
import mysqldump, { DumpReturn } from 'mysqldump';
import prismaConfig from 'src/prisma/prisma.config';

import dayjs from 'dayjs';
import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(prismaConfig.KEY)
    private readonly config: ConfigType<typeof prismaConfig>,
  ) {}

  async backup(): ReturnWithErrPromise<DumpReturn> {
    try {
      const filename = `dump-${dayjs().format('DD-MM-YYYY')}.sql`;

      const result = await mysqldump({
        connection: {
          host: this.config.host,
          user: this.config.user!,
          password: this.config.password!,
          database: this.config.database!,
        },
        dumpToFile: `./backups/${filename}`,
      });

      return [result, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
