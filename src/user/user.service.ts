import type { Prisma, User } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where,
        include,
        omit,
      });
      if (!user) throw new NotFoundException('User not found!');
      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.UserWhereInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  } = {}): ReturnWithErrPromise<User[]> {
    try {
      const users = await this.prisma.user.findMany({ where, include, omit });
      return [users, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    include,
    omit,
  }: {
    data: Prisma.UserCreateInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<User> {
    try {
      const user = await this.prisma.user.create({ data, include, omit });
      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update({
    data,
    where,
    include,
    omit,
  }: {
    data: Prisma.UserUpdateInput;
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<User> {
    try {
      const user = await this.prisma.user.update({
        where,
        data,
        include,
        omit,
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    include,
    omit,
  }: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<User> {
    try {
      const user = await this.prisma.user.delete({ where, include, omit });
      if (!user) throw new NotFoundException('User not found!');
      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
