import type { Prisma, User, Address } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { exceptionHandler } from '@helper/exception.helper';
import { UpdateUserDto, AddressDto } from './dto/update-user.dto';

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

  async update(
    {
      data,
      where,
      include,
      omit,
    }: {
      data: UpdateUserDto;
      where: Prisma.UserWhereUniqueInput;
      include?: Prisma.UserInclude;
      omit?: Prisma.UserOmit;
    },
    userId: number,
  ): ReturnWithErrPromise<User> {
    try {
      const { address, ...userData } = data;

      await this.addressHandler(userId, address);

      const user = await this.prisma.user.update({
        where,
        data: userData,
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

  private async addressHandler(userId: number, address?: AddressDto | null) {
    if (address) {
      const addressData: Address = {
        userId,
        address: address.address ?? null,
        latitude: address.latitude ?? null,
        longitude: address.longitude ?? null,
      };

      await this.prisma.address.upsert({
        where: { userId },
        update: addressData,
        create: addressData,
      });
    }

    if (address === null) {
      await this.prisma.address.delete({ where: { userId } });
    }
  }
}
