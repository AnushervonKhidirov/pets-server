import type { Prisma } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async upsert(data: Prisma.VerifyMailCreateInput): ReturnWithErrPromise {
    try {
      await this.prisma.verifyMail.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async verify({
    email,
    code,
  }: Prisma.VerifyMailWhereUniqueInput): ReturnWithErrPromise {
    try {
      const verifyData = await this.prisma.verifyMail.findUnique({
        where: { email },
      });

      if (!verifyData) {
        throw new NotFoundException('Verification code not found!');
      }

      if (verifyData.code !== code) {
        throw new BadRequestException('Wrong verification code!');
      }

      if (dayjs(verifyData.expiredAt).diff(dayjs()) < 0) {
        throw new BadRequestException('Verification code expired!');
      }

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({ email }: Prisma.VerifyMailWhereUniqueInput) {
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
