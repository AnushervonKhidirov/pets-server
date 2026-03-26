import { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

type Statistic = {
  totalUser: number;
  totalPets: number;
  lostPets: number;
  foundPets: number;
};

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatistic(): ReturnWithErrPromise<Statistic> {
    try {
      const totalUser = await this.prisma.user.count();
      const totalPets = await this.prisma.pet.count();

      const lostPets = await this.prisma.pet.count({
        where: { hadLost: true },
      });

      const foundPets = await this.prisma.pet.count({
        where: { hadFound: true },
      });

      const statistic: Statistic = {
        totalUser,
        totalPets,
        lostPets,
        foundPets,
      };

      return [statistic, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
