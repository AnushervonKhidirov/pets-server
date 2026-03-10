import type { Prisma, ResetPasswordUrl } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { exceptionHandler } from '@helper/exception.helper';

import { hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordService {
  readonly verifyExpiresIn = dayjs.duration(10, 'm');

  constructor(private readonly prisma: PrismaService) {}

  async hash(password: string) {
    return await hash(password, 10);
  }

  async compare(password: string, hash: string) {
    const isCorrectPassword = await compare(password, hash);
    if (!isCorrectPassword) throw new BadRequestException('Wrong password');
  }

  // NOTE: Reset password methods
  async generateResetUrl(
    email: string,
  ): ReturnWithErrPromise<ResetPasswordUrl> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new NotFoundException('User with this email not found');

      return [
        {
          email: user.email,
          pageId: v4(),
          expiredAt: dayjs().add(this.verifyExpiresIn).toDate(),
        },
        null,
      ];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async upsertResetPageId(
    data: Prisma.ResetPasswordUrlCreateInput,
  ): ReturnWithErrPromise<ResetPasswordUrl> {
    try {
      const resetData = await this.prisma.resetPasswordUrl.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });

      return [resetData, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async checkResetPageId(
    pageId: string,
  ): ReturnWithErrPromise<ResetPasswordUrl> {
    try {
      const resetData = await this.prisma.resetPasswordUrl.findUnique({
        where: { pageId },
      });

      if (!resetData) {
        throw new NotFoundException('Password page id not found!');
      }

      if (dayjs(resetData.expiredAt).diff(dayjs()) < 0) {
        await this.deleteResetPageId(pageId);
        throw new BadRequestException('Password page id expired!');
      }

      return [resetData, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async resetPassword(
    resetData: ResetPasswordUrl,
    newPassword: string,
  ): ReturnWithErrPromise {
    try {
      const hashPassword = await this.hash(newPassword);

      await this.prisma.user.update({
        where: { email: resetData.email },
        data: { password: hashPassword },
      });

      await this.deleteResetPageId(resetData.pageId);

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteResetPageId(pageId: string): ReturnWithErrPromise {
    try {
      await this.prisma.resetPasswordUrl.delete({ where: { pageId } });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteExpiredResetPageId(): ReturnWithErrPromise {
    try {
      await this.prisma.resetPasswordUrl.deleteMany({
        where: { expiredAt: { lte: new Date() } },
      });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
