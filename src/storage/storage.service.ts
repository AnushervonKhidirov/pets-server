import type { ConfigType } from '@nestjs/config';

import type { ReturnWithErrPromise } from '@type/return-with-err.type';
import {
  Injectable,
  Inject,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

import s3Config from './storage.config';
import { join } from 'node:path';
import { exceptionHandler } from '@helper/exception.helper';
import { Readable } from 'node:stream';

@Injectable()
export class S3Storage {
  private readonly s3Client: S3Client;
  private readonly development = process.env.NODE_ENV === 'development';
  private readonly environmentFolder = this.development ? 'dev' : 'prod';

  constructor(
    @Inject(s3Config.KEY)
    private readonly config: ConfigType<typeof s3Config>,
  ) {
    this.s3Client = new S3Client({
      region: this.config.region,
      endpoint: this.config.endpoint,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async upload(file: Express.Multer.File, folder: string, filename: string) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: join(this.environmentFolder, folder, filename),
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
  }

  async get(
    folder: string,
    filename: string,
  ): ReturnWithErrPromise<StreamableFile> {
    try {
      const { Body, ContentType, ContentLength } = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.config.bucketName,
          Key: join(this.environmentFolder, folder, filename),
        }),
      );

      if (!Body) throw new NotFoundException('Fuck you!');

      const stream = Body as Readable;

      return [
        new StreamableFile(stream, {
          type: ContentType,
          length: ContentLength,
        }),
        null,
      ];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(folder: string, filename: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: join(this.environmentFolder, folder, filename),
      }),
    );
  }
}
