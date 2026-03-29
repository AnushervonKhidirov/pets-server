import type { Prisma, City } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  async count({
    where,
  }: {
    where?: Prisma.CityWhereInput;
  } = {}): ReturnWithErrPromise<number> {
    try {
      const total = await this.prisma.city.count({ where });
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
    where: Prisma.CityWhereUniqueInput;
    omit?: Prisma.CityOmit;
    include?: Prisma.CityInclude;
  }): ReturnWithErrPromise<City> {
    try {
      const city = await this.prisma.city.findUnique({
        where,
        omit,
        include,
      });

      if (!city) throw new NotFoundException('City not found');

      return [city, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    omit,
    include,
    skip,
    take,
  }: {
    where?: Prisma.CityWhereInput;
    omit?: Prisma.CityOmit;
    include?: Prisma.CityInclude;
    skip?: number;
    take?: number;
  } = {}): ReturnWithErrPromise<City[]> {
    try {
      const cities = await this.prisma.city.findMany({
        where,
        omit,
        include,
        skip,
        take,
      });

      return [cities, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    omit,
    include,
  }: {
    data: Prisma.CityCreateInput;
    omit?: Prisma.CityOmit;
    include?: Prisma.CityInclude;
  }): ReturnWithErrPromise<City> {
    try {
      const city = await this.prisma.city.create({
        data,
        omit,
        include,
      });

      return [city, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async createMany({
    data,
  }: {
    data: Prisma.CityCreateManyInput[];
  }): ReturnWithErrPromise<Prisma.BatchPayload> {
    try {
      const batchPayload = await this.prisma.city.createMany({ data });
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
    where: Prisma.CityWhereUniqueInput;
    data: Prisma.CityUpdateInput;
    omit?: Prisma.CityOmit;
    include?: Prisma.CityInclude;
  }): ReturnWithErrPromise<City> {
    try {
      const city = await this.prisma.city.update({
        where,
        data,
        omit,
        include,
      });

      if (!city) throw new NotFoundException('City not found');

      return [city, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    omit,
    include,
  }: {
    where: Prisma.CityWhereUniqueInput;
    omit?: Prisma.CityOmit;
    include?: Prisma.CityInclude;
  }): ReturnWithErrPromise<City> {
    try {
      const city = await this.prisma.city.delete({
        where,
        omit,
        include,
      });

      if (!city) throw new NotFoundException('City not found');

      return [city, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
