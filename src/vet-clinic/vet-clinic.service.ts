import type { Prisma, VetClinic } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class VetClinicService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
  }: {
    where: Prisma.VetClinicWhereUniqueInput;
  }): ReturnWithErrPromise<VetClinic> {
    try {
      const vetClinic = await this.prisma.vetClinic.findUnique({ where });
      if (!vetClinic) throw new NotFoundException();
      return [vetClinic, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
  }: {
    where?: Prisma.VetClinicWhereInput;
  } = {}): ReturnWithErrPromise<VetClinic[]> {
    try {
      const vetClinics = await this.prisma.vetClinic.findMany({ where });
      return [vetClinics, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
  }: {
    data: Prisma.VetClinicCreateInput;
  }): ReturnWithErrPromise<VetClinic> {
    try {
      const vetClinic = await this.prisma.vetClinic.create({ data });
      return [vetClinic, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update({
    where,
    data,
  }: {
    where: Prisma.VetClinicWhereUniqueInput;
    data: Prisma.VetClinicUpdateInput;
  }): ReturnWithErrPromise<VetClinic> {
    try {
      const vetClinic = await this.prisma.vetClinic.update({ where, data });
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
