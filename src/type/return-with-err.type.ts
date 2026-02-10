import { HttpException } from '@nestjs/common';

export type ReturnWithErr<T = null> = [T, null] | [null, HttpException];
export type ReturnWithErrPromise<T = null> = Promise<ReturnWithErr<T>>;
