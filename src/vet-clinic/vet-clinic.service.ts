import type { Prisma, VetClinic } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class VetClinicService {
  constructor(private readonly prisma: PrismaService) {}

  async count({
    where,
  }: {
    where?: Prisma.VetClinicWhereInput;
  } = {}): ReturnWithErrPromise<number> {
    try {
      const total = await this.prisma.vetClinic.count({ where });
      return [total, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findOne({
    where,
    include,
  }: {
    where: Prisma.VetClinicWhereUniqueInput;
    include?: Prisma.VetClinicInclude;
  }): ReturnWithErrPromise<VetClinic> {
    try {
      const vetClinic = await this.prisma.vetClinic.findUnique({
        where,
        include,
      });
      if (!vetClinic) throw new NotFoundException();
      return [vetClinic, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
  }: {
    where?: Prisma.VetClinicWhereInput;
    include?: Prisma.VetClinicInclude;
  } = {}): ReturnWithErrPromise<VetClinic[]> {
    try {
      const vetClinics = await this.prisma.vetClinic.findMany({
        where,
        include,
      });
      return [vetClinics, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    include,
  }: {
    data: Prisma.VetClinicCreateInput;
    include?: Prisma.VetClinicInclude;
  }): ReturnWithErrPromise<VetClinic> {
    try {
      const vetClinic = await this.prisma.vetClinic.create({ data, include });
      return [vetClinic, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update({
    where,
    data,
    include,
  }: {
    where: Prisma.VetClinicWhereUniqueInput;
    data: Prisma.VetClinicUpdateInput;
    include?: Prisma.VetClinicInclude;
  }): ReturnWithErrPromise<VetClinic> {
    try {
      const vetClinic = await this.prisma.vetClinic.update({
        where,
        data,
        include,
      });
      return [vetClinic, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
  }: {
    where: Prisma.VetClinicWhereUniqueInput;
  }): ReturnWithErrPromise<VetClinic> {
    try {
      const vetClinic = await this.prisma.vetClinic.delete({ where });
      return [vetClinic, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
