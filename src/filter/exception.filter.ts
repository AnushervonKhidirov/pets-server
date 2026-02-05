import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

import type {
  HttpExceptionBody,
  HttpExceptionBodyMessage,
} from '@nestjs/common';

type CustomHttpExceptionBody = {
  error: string;
  statusCode: number;
  message?: HttpExceptionBodyMessage;
};

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpException =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException();

    const status = httpException.getStatus();
    const exceptionResponse = <HttpExceptionBody | string>(
      httpException.getResponse()
    );

    if (typeof exceptionResponse === 'string') {
      response
        .status(status)
        .json({ error: exceptionResponse, statusCode: status });
      return;
    }

    const customExceptionResponse = this.convertException(exceptionResponse);

    response.status(status).json(customExceptionResponse);
  }

  private convertException(
    exceptionBody: HttpExceptionBody,
  ): CustomHttpExceptionBody {
    const responseBody: CustomHttpExceptionBody = {
      error: exceptionBody.error ?? (exceptionBody.message as string),
      message:
        exceptionBody.error && exceptionBody.message
          ? exceptionBody.message
          : undefined,
      statusCode: exceptionBody.statusCode,
    };

    if (!responseBody.message) delete responseBody.message;

    return responseBody;
  }
}
