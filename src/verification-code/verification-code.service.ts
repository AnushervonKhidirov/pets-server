import type { Prisma } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class VerificationCodeService {
  readonly verifyExpiresIn = dayjs.duration(10, 'm');

  constructor(private readonly prisma: PrismaService) {}

  generate() {
    return {
      code: Math.floor(Math.random() * 999_999).toString(),
      expiredAt: dayjs().add(this.verifyExpiresIn).toDate(),
    };
  }

  async upsert({
    email,
    code,
    expiredAt,
  }: Prisma.VerifyMailCreateInput): ReturnWithErrPromise {
    try {
      await this.prisma.verifyMail.upsert({
        where: { email },
        update: { code, expiredAt },
        create: { email, code, expiredAt },
      });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({ email }: { email: string }) {
    try {
      await this.prisma.verifyMail.delete({ where: { email } });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteExpired() {
    try {
      await this.prisma.verifyMail.deleteMany({
        where: { expiredAt: { lte: new Date() } },
      });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
