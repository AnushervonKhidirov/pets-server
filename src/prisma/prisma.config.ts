import { PoolConfig } from 'mariadb';
import { registerAs } from '@nestjs/config';

function parseIntEnv(envString: string | undefined): number | undefined {
  return envString ? Number.parseInt(envString) : undefined;
}

export default registerAs<PoolConfig>('database', () => {
  return {
    port: parseIntEnv(process.env.DB_PORT),
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
});
