import type { Prisma, LostInfo } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class LostInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.LostInfoWhereUniqueInput;
    include?: Prisma.LostInfoInclude;
    omit?: Prisma.LostInfoOmit;
  }): ReturnWithErrPromise<LostInfo> {
    try {
      const lostInfo = await this.prisma.lostInfo.findUnique({
        where,
        include,
        omit,
      });

      if (!lostInfo) throw new NotFoundException();

      return [lostInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.LostInfoWhereInput;
    include?: Prisma.LostInfoInclude;
    omit?: Prisma.LostInfoOmit;
  } = {}): ReturnWithErrPromise<LostInfo[]> {
    try {
      const lostInfo = await this.prisma.lostInfo.findMany({
        where,
        include,
        omit,
      });

      return [lostInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    include,
    omit,
  }: {
    data: Prisma.LostInfoCreateInput;
    include?: Prisma.LostInfoInclude;
    omit?: Prisma.LostInfoOmit;
  }): ReturnWithErrPromise<LostInfo> {
    try {
      const lostInfo = await this.prisma.lostInfo.create({
        data,
        include,
        omit,
      });

      return [lostInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update({
    where,
    data,
    include,
    omit,
  }: {
    where: Prisma.LostInfoWhereUniqueInput;
    data: Prisma.LostInfoUpdateInput;
    include?: Prisma.LostInfoInclude;
    omit?: Prisma.LostInfoOmit;
  }): ReturnWithErrPromise<LostInfo> {
    try {
      const lostInfo = await this.prisma.lostInfo.update({
        where,
        data,
        include,
        omit,
      });

      return [lostInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async upsert({
    where,
    data,
    include,
    omit,
  }: {
    where: Prisma.LostInfoWhereUniqueInput;
    data: Prisma.LostInfoCreateInput;
    include?: Prisma.LostInfoInclude;
    omit?: Prisma.LostInfoOmit;
  }): ReturnWithErrPromise<LostInfo> {
    try {
      const lostInfo = await this.prisma.lostInfo.upsert({
        where,
        update: data,
        create: data,
        include,
        omit,
      });

      return [lostInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    include,
    omit,
  }: {
    where: Prisma.LostInfoWhereUniqueInput;
    include?: Prisma.LostInfoInclude;
    omit?: Prisma.LostInfoOmit;
  }): ReturnWithErrPromise<LostInfo> {
    try {
      const lostInfo = await this.prisma.lostInfo.delete({
        where,
        include,
        omit,
      });

      return [lostInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
