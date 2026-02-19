import type { Response } from 'express';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private readonly storage: Storage;
  private readonly bucketName = process.env.GOOGLE_BUCKET_NAME!;

  constructor() {
    this.storage = new Storage();
  }

  async upload(file: Express.Multer.File, folder: string, filename: string) {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(`${folder}/${filename}`);

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
        resolve({ message: 'Загружено!', url: publicUrl });
      });

      blobStream.end(file.buffer);
    });
  }

  async get(folder: string, filename: string, res: Response) {
    const bucket = this.storage.bucket(this.bucketName);
    const remoteFile = bucket.file(`${folder}/${filename}`);

    const [exists] = await remoteFile.exists();
    if (!exists) throw new NotFoundException();

    res.setHeader('Content-Type', remoteFile.metadata.contentType ?? 'image/*');
    remoteFile.createReadStream().pipe(res);
  }

  async delete(folder: string, filename: string) {
    const bucket = this.storage.bucket(this.bucketName);
    const remoteFile = bucket.file(`${folder}/${filename}`);
    await remoteFile.delete({ ignoreNotFound: true });
  }
}
