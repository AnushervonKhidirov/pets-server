import type { Request } from 'express';
import type { TokenDecoded } from 'src/token/token.type';

import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  Req,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';

import { LostInfoService } from './lost-info.service';
import { PetService } from 'src/pet/service/pet.service';

import { CreateLostInfoDto } from './dto/create-lost-info.dto';
import { QueryLostInfoDto } from './dto/query-lost-info.dto';

@Controller('lost-info')
export class LostInfoController {
  constructor(
    private readonly lostInfoService: LostInfoService,
    private readonly petService: PetService,
  ) {}

  @UseGuards(AuthGuard)
  @Post(':petUUID')
  async set(
    @Req() req: Request,
    @Param('petUUID') petUUID: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateLostInfoDto,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryLostInfoDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const hadLost = query.addToStatistic ? true : undefined;

    const [, lostPetErr] = await this.petService.update({
      where: { uuid: petUUID },
      data: { hadLost, lost: true },
    });

    if (lostPetErr) throw lostPetErr;

    const [lostInfo, err] = await this.lostInfoService.upsert({
      where: { petId: petUUID, pet: { userId: tokenDecoded.sub } },
      data: { ...data, pet: { connect: { uuid: petUUID } } },
    });

    if (err) throw err;
    return lostInfo;
  }

  @UseGuards(AuthGuard)
  @Delete(':petUUID')
  async delete(
    @Req() req: Request,
    @Param('petUUID') petUUID: string,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryLostInfoDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const hadFound = query.addToStatistic ? true : undefined;

    const [, lostPetErr] = await this.petService.update({
      where: { uuid: petUUID },
      data: { hadFound, hadLost: hadFound, lost: false },
    });

    if (lostPetErr) throw lostPetErr;

    const [, err] = await this.lostInfoService.delete({
      where: { petId: petUUID, pet: { userId: tokenDecoded.sub } },
    });
    if (err) throw err;
  }
}
