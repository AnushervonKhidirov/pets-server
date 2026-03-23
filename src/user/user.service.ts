import type { Prisma, User, Address } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/reset-password/password.service';

import { UpdateUserDto, AddressDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

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

  async changePassword(
    userId: number,
    { newPassword, oldPassword }: ChangePasswordDto,
  ): ReturnWithErrPromise {
    try {
      const [user, err] = await this.findOne({ where: { id: userId } });

      if (err) throw err;

      if (!user.password) {
        throw new BadRequestException(
          `You have been logged in with ${user.authType}`,
        );
      }

      await this.passwordService.compare(oldPassword, user.password);
      const hashPassword = await this.passwordService.hash(newPassword);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashPassword },
      });

      return [null, null];
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
        ...address,
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
