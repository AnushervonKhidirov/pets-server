import type { Prisma, Pet } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Storage } from 'src/storage/storage.service';

import { exceptionHandler } from '@helper/exception.helper';
import { CreatePetDto } from '../dto/create-pet.dto';

@Injectable()
export class PetService {
  private readonly storageFolder = 'pets';

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Storage: S3Storage,
  ) {}

  async count({
    where,
  }: {
    where?: Prisma.PetWhereInput;
  } = {}): ReturnWithErrPromise<number> {
    try {
      const total = await this.prisma.pet.count({ where });
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
    where: Prisma.PetWhereUniqueInput;
    omit?: Prisma.PetOmit;
    include?: Prisma.PetInclude;
  }): ReturnWithErrPromise<Pet> {
    try {
      const pet = await this.prisma.pet.findUnique({
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
    skip,
    take,
  }: {
    where?: Prisma.PetWhereInput;
    omit?: Prisma.PetOmit;
    include?: Prisma.PetInclude;
    skip?: number;
    take?: number;
  } = {}): ReturnWithErrPromise<Pet[]> {
    try {
      const pets = await this.prisma.pet.findMany({
        where,
        omit,
        include,
        skip,
        take,
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
    omit?: Prisma.PetOmit;
    include?: Prisma.PetInclude;
  }): ReturnWithErrPromise<Pet> {
    try {
      const pet = await this.prisma.pet.create({
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
    where: Prisma.PetWhereUniqueInput;
    data: Prisma.PetUpdateInput;
    omit?: Prisma.PetOmit;
    include?: Prisma.PetInclude;
  }): ReturnWithErrPromise<Pet> {
    try {
      const pet = await this.prisma.pet.update({
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
    where: Prisma.PetWhereUniqueInput;
    omit?: Prisma.PetOmit;
    include?: Prisma.PetInclude;
  }): ReturnWithErrPromise<Pet> {
    try {
      const pet = await this.prisma.pet.delete({
        where,
        omit,
        include,
      });

      if (!pet) throw new NotFoundException('Pet not found');

      if (pet.image) {
        await this.s3Storage.delete(this.storageFolder, pet.image);
      }

      return [pet, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
