import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: getEnv(), isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

function getEnv(): string {
  const env = process.env.NODE_ENV ?? '';

  const envFileNames: Record<string, string> = {
    development: '.env.development.local',
  };

  return env in envFileNames ? envFileNames[env] : '.env';
}
