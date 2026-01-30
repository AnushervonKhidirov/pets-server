import { HttpException } from '@nestjs/common';

export type ReturnWithErr<T> = [T, null] | [null, HttpException];
export type ReturnWithErrPromise<T> = Promise<ReturnWithErr<T>>;
