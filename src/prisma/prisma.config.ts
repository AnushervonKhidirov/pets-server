import { PoolConfig } from 'mariadb';

import { registerAs } from '@nestjs/config';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function parseIntEnv(envString: string | undefined): number | undefined {
  return envString ? Number.parseInt(envString) : undefined;
}

export default registerAs<PoolConfig>('database', () => {
  const sslCertPath = join(process.cwd(), 'secret', 'ca.pem');
  const useSsl =
    process.env.DB_SSL !== 'false' && existsSync(sslCertPath);

  return {
    port: parseIntEnv(process.env.DB_PORT),
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: parseIntEnv(process.env.DB_CONNECTION_TIMEOUT),
    ...(useSsl && {
      ssl: {
        ca: readFileSync(sslCertPath).toString(),
        rejectUnauthorized: true,
      },
    }),
  };
});
