import type { Prisma, Breed } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';
import { CreateBreedDto } from '../dto/create-breed.dto';

@Injectable()
export class BreedService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    omit,
    include,
  }: {
    where: Prisma.BreedWhereUniqueInput;
    omit?: Prisma.BreedOmit;
    include?: Prisma.BreedInclude;
  }): ReturnWithErrPromise<Breed> {
    try {
      const breed = await this.prisma.breed.findUnique({
        where,
        omit,
        include,
      });

      if (!breed) throw new NotFoundException('Breed type not found');

      return [breed, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    omit,
    include,
  }: {
    where?: Prisma.BreedWhereInput;
    omit?: Prisma.BreedOmit;
    include?: Prisma.BreedInclude;
  } = {}): ReturnWithErrPromise<Breed[]> {
    try {
      const breeds = await this.prisma.breed.findMany({
        where,
        omit,
        include,
      });

      return [breeds, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    omit,
    include,
  }: {
    data: CreateBreedDto;
    omit?: Prisma.BreedOmit;
    include?: Prisma.BreedInclude;
  }): ReturnWithErrPromise<Breed> {
    try {
      const breed = await this.prisma.breed.create({
        data,
        omit,
        include,
      });

      return [breed, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async createMany({
    data,
  }: {
    data: Prisma.BreedCreateManyInput[];
  }): ReturnWithErrPromise<Prisma.BatchPayload> {
    try {
      const breed = await this.prisma.breed.createMany({ data });

      return [breed, null];
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
    where: Prisma.BreedWhereUniqueInput;
    data: Prisma.BreedUpdateInput;
    omit?: Prisma.BreedOmit;
    include?: Prisma.BreedInclude;
  }): ReturnWithErrPromise<Breed> {
    try {
      const breed = await this.prisma.breed.update({
        where,
        data,
        omit,
        include,
      });

      if (!breed) throw new NotFoundException('Breed type not found');

      return [breed, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    omit,
    include,
  }: {
    where: Prisma.BreedWhereUniqueInput;
    omit?: Prisma.BreedOmit;
    include?: Prisma.BreedInclude;
  }): ReturnWithErrPromise<Breed> {
    try {
      const breed = await this.prisma.breed.delete({
        where,
        omit,
        include,
      });

      if (!breed) throw new NotFoundException('Breed type not found');

      return [breed, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
