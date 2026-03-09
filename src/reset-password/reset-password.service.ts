import type { Prisma, ResetPasswordUrl } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class ResetPasswordService {
  readonly verifyExpiresIn = dayjs.duration(10, 'm');

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async generate(email: string): ReturnWithErrPromise<ResetPasswordUrl> {
    try {
      const [user, err] = await this.userService.findOne({ where: { email } });

      if (err) throw err;

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

  async upsert(data: Prisma.ResetPasswordUrlCreateInput): ReturnWithErrPromise {
    try {
      await this.prisma.resetPasswordUrl.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async check(pageId: string): ReturnWithErrPromise {
    try {
      const verifyData = await this.prisma.resetPasswordUrl.findUnique({
        where: { pageId },
      });

      if (!verifyData) {
        throw new NotFoundException('Password page id!');
      }

      if (verifyData.pageId !== pageId) {
        throw new BadRequestException('Wrong password page id!');
      }

      if (dayjs(verifyData.expiredAt).diff(dayjs()) < 0) {
        throw new BadRequestException('Password page id expired!');
      }

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(pageId: string) {
    try {
      await this.prisma.resetPasswordUrl.delete({ where: { pageId } });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteExpired() {
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
