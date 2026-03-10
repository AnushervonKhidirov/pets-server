import './utils/config/dayjs.config';
import corsConfig from './utils/config/cors.config';

import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filter/exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsConfig });

  const { httpAdapter } = app.get(HttpAdapterHost);

  const config = new DocumentBuilder()
    .setTitle('Pets')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
  app.use(cookieParser());
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
