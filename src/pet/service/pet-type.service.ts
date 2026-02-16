import type { Prisma, PetType } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class PetTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    omit,
    include,
  }: {
    where: Prisma.PetTypeWhereUniqueInput;
    omit?: Prisma.PetTypeOmit;
    include?: Prisma.PetTypeInclude;
  }): ReturnWithErrPromise<PetType> {
    try {
      const petType = await this.prisma.petType.findUnique({
        where,
        omit,
        include,
      });

      if (!petType) throw new NotFoundException('Pet type not found');

      return [petType, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    omit,
    include,
  }: {
    where?: Prisma.PetTypeWhereInput;
    omit?: Prisma.PetTypeOmit;
    include?: Prisma.PetTypeInclude;
  } = {}): ReturnWithErrPromise<PetType[]> {
    try {
      const petTypes = await this.prisma.petType.findMany({
        where,
        omit,
        include,
      });

      return [petTypes, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    omit,
    include,
  }: {
    data: Prisma.PetTypeCreateInput;
    omit?: Prisma.PetTypeOmit;
    include?: Prisma.PetTypeInclude;
  }): ReturnWithErrPromise<PetType> {
    try {
      const petType = await this.prisma.petType.create({
        data,
        omit,
        include,
      });

      return [petType, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async createMany({
    data,
  }: {
    data: Prisma.PetTypeCreateManyInput[];
  }): ReturnWithErrPromise<Prisma.BatchPayload> {
    try {
      const petType = await this.prisma.petType.createMany({ data });

      return [petType, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update({
    where,
    data,
    omit,
    include,
  }: {
    where: Prisma.PetTypeWhereUniqueInput;
    data: Prisma.PetTypeUpdateInput;
    omit?: Prisma.PetTypeOmit;
    include?: Prisma.PetTypeInclude;
  }): ReturnWithErrPromise<PetType> {
    try {
      const petType = await this.prisma.petType.update({
        where,
        data,
        omit,
        include,
      });

      if (!petType) throw new NotFoundException('Pet type not found');

      return [petType, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    omit,
    include,
  }: {
    where: Prisma.PetTypeWhereUniqueInput;
    omit?: Prisma.PetTypeOmit;
    include?: Prisma.PetTypeInclude;
  }): ReturnWithErrPromise<PetType> {
    try {
      const petType = await this.prisma.petType.delete({
        where,
        omit,
        include,
      });

      if (!petType) throw new NotFoundException('Pet type not found');

      return [petType, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
