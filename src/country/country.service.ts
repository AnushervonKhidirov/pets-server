import type { Prisma, Country } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  async count({
    where,
  }: {
    where?: Prisma.CountryWhereInput;
  } = {}): ReturnWithErrPromise<number> {
    try {
      const total = await this.prisma.country.count({ where });
      return [total, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findOne({
    where,
    omit,
    include,
  }: {
    where: Prisma.CountryWhereUniqueInput;
    omit?: Prisma.CountryOmit;
    include?: Prisma.CountryInclude;
  }): ReturnWithErrPromise<Country> {
    try {
      const country = await this.prisma.country.findUnique({
        where,
        omit,
        include,
      });

      if (!country) throw new NotFoundException('Country not found');

      return [country, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    omit,
    include,
  }: {
    where?: Prisma.CountryWhereInput;
    omit?: Prisma.CountryOmit;
    include?: Prisma.CountryInclude;
  } = {}): ReturnWithErrPromise<Country[]> {
    try {
      const countries = await this.prisma.country.findMany({
        where,
        omit,
        include,
      });

      return [countries, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    omit,
    include,
  }: {
    data: Prisma.CountryCreateInput;
    omit?: Prisma.CountryOmit;
    include?: Prisma.CountryInclude;
  }): ReturnWithErrPromise<Country> {
    try {
      const country = await this.prisma.country.create({
        data,
        omit,
        include,
      });

      return [country, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async createMany({
    data,
  }: {
    data: Prisma.CountryCreateManyInput[];
  }): ReturnWithErrPromise<Prisma.BatchPayload> {
    try {
      const batchPayload = await this.prisma.country.createMany({ data });
      return [batchPayload, null];
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
    where: Prisma.CountryWhereUniqueInput;
    data: Prisma.CountryUpdateInput;
    omit?: Prisma.CountryOmit;
    include?: Prisma.CountryInclude;
  }): ReturnWithErrPromise<Country> {
    try {
      const country = await this.prisma.country.update({
        where,
        data,
        omit,
        include,
      });

      if (!country) throw new NotFoundException('Country not found');

      return [country, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    omit,
    include,
  }: {
    where: Prisma.CountryWhereUniqueInput;
    omit?: Prisma.CountryOmit;
    include?: Prisma.CountryInclude;
  }): ReturnWithErrPromise<Country> {
    try {
      const country = await this.prisma.country.delete({
        where,
        omit,
        include,
      });

      if (!country) throw new NotFoundException('Country not found');

      return [country, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
