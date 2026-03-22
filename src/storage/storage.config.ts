import { registerAs } from '@nestjs/config';

export default registerAs('s3_config', () => ({
  region: process.env.S3_REGION!,
  accessKey: process.env.S3_ACCESS_KEY!,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  endpoint: process.env.S3_ENDPOINT!,
  bucketName: process.env.S3_BUCKET_NAME!,
}));
