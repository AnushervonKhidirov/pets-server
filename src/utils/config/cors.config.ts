import 'dotenv/config';
import type { NestApplicationOptions } from '@nestjs/common';

const environment = process.env.NODE_ENV;
const allowedOrigins = new Set((process.env.ALLOWED_ORIGINS ?? '').split(';'));

function allowOriginCheck(origin: string) {
  return (
    allowedOrigins.has(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin)
  );
}

const cors: NestApplicationOptions['cors'] =
  environment === 'development'
    ? true
    : {
        origin: (origin, callback) => {
          if (!origin || allowOriginCheck(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
      };

export default cors;
