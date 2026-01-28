import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: getEnv(), isGlobal: true })],
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
