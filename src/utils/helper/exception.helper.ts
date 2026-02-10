import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from 'prisma/generated/prisma/internal/prismaNamespace';

export function exceptionHandler(err: unknown): [null, HttpException] {
  if (err instanceof HttpException) return [null, err];
  if (isPrismaError(err)) return [null, prismaErrHandler(err)];

  if (err instanceof PrismaClientValidationError) {
    return [null, new BadRequestException()];
  }

  return [
    null,
    new InternalServerErrorException(
      'Something went wrong, please try again later',
    ),
  ];
}

function prismaErrHandler(err: PrismaClientKnownRequestError) {
  const Error: {
    [key: PrismaClientKnownRequestError['code']]: HttpException;
  } = {
    P2025: new NotFoundException(`Database Error. Code ${err.code}`),
    P2002: new ConflictException(`Database Error. Code ${err.code}`),
    P2003: new BadRequestException(`Database Error. Code ${err.code}`),
  };

  if (!Error[err.code]) {
    return new InternalServerErrorException(`Database Error. Code ${err.code}`);
  }

  return Error[err.code];
}

function isPrismaError(err: unknown) {
  return err instanceof PrismaClientKnownRequestError;
}
