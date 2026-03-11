import type { NestApplicationOptions } from '@nestjs/common';

const environment = process.env.NODE_ENV;

const corsConfig: NestApplicationOptions['cors'] =
  environment === 'development'
    ? true
    : { origin: ['https://pets-website-rho.vercel.app'] };

export default corsConfig;
