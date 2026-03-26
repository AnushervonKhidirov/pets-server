import type { Request } from 'express';
import type { TokenDecoded } from 'src/token/token.type';

import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  Req,
  ParseIntPipe,
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
  @Post(':petId')
  async set(
    @Req() req: Request,
    @Param('petId', ParseIntPipe) petId: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateLostInfoDto,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryLostInfoDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    if (query.addToStatistic) {
      const [, err] = await this.petService.update({
        where: { id: petId },
        data: { hadLost: true },
      });

      if (err) throw err;
    }

    const [lostInfo, err] = await this.lostInfoService.upsert({
      where: { petId, pet: { userId: tokenDecoded.sub } },
      data: { ...data, pet: { connect: { id: petId } } },
    });

    if (err) throw err;
    return lostInfo;
  }

  @UseGuards(AuthGuard)
  @Delete(':petId')
  async delete(
    @Req() req: Request,
    @Param('petId', ParseIntPipe) petId: number,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryLostInfoDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    if (query.addToStatistic) {
      const [, err] = await this.petService.update({
        where: { id: petId },
        data: { hadFound: true, hadLost: true },
      });

      if (err) throw err;
    }

    const [, err] = await this.lostInfoService.delete({
      where: { petId, pet: { userId: tokenDecoded.sub } },
    });
    if (err) throw err;
  }
}
