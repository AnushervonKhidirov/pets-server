import type { Prisma, Pets } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';
import { CreatePetDto } from '../dto/create-pet.dto';

@Injectable()
export class PetService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    omit,
    include,
  }: {
    where: Prisma.PetsWhereUniqueInput;
    omit?: Prisma.PetsOmit;
    include?: Prisma.PetsInclude;
  }): ReturnWithErrPromise<Pets> {
    try {
      const pet = await this.prisma.pets.findUnique({
        where,
        omit,
        include,
      });

      if (!pet) throw new NotFoundException('Pet not found');

      return [pet, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    omit,
    include,
  }: {
    where?: Prisma.PetsWhereInput;
    omit?: Prisma.PetsOmit;
    include?: Prisma.PetsInclude;
  } = {}): ReturnWithErrPromise<Pets[]> {
    try {
      const pets = await this.prisma.pets.findMany({
        where,
        omit,
        include,
      });

      return [pets, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    omit,
    include,
  }: {
    data: CreatePetDto & { userId: number };
    omit?: Prisma.PetsOmit;
    include?: Prisma.PetsInclude;
  }): ReturnWithErrPromise<Pets> {
    try {
      const pet = await this.prisma.pets.create({
        data,
        omit,
        include,
      });

      return [pet, null];
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
    where: Prisma.PetsWhereUniqueInput;
    data: Prisma.PetsUpdateInput;
    omit?: Prisma.PetsOmit;
    include?: Prisma.PetsInclude;
  }): ReturnWithErrPromise<Pets> {
    try {
      const pet = await this.prisma.pets.update({
        where,
        data,
        omit,
        include,
      });

      if (!pet) throw new NotFoundException('Pet not found');

      return [pet, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    omit,
    include,
  }: {
    where: Prisma.PetsWhereUniqueInput;
    omit?: Prisma.PetsOmit;
    include?: Prisma.PetsInclude;
  }): ReturnWithErrPromise<Pets> {
    try {
      const pet = await this.prisma.pets.delete({
        where,
        omit,
        include,
      });

      if (!pet) throw new NotFoundException('Pet not found');

      return [pet, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
