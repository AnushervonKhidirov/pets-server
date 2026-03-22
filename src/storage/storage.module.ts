import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Storage } from './storage.service';
import s3Config from './storage.config';

@Module({
  imports: [ConfigModule.forFeature(s3Config)],
  providers: [S3Storage],
  exports: [S3Storage],
})
export class StorageModule {}
