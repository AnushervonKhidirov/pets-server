import type { Request } from 'express';
import type { TokenDecoded } from 'src/token/token.type';

import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';

import { LostInfoService } from './lost-info.service';
import { PetService } from 'src/pet/service/pet.service';

import { CreateLostInfoDto } from './dto/create-lost-info.dto';
import { UpdateLostInfoDto } from './dto/update-lost-info.dto';

@Controller('lost-info')
export class LostInfoController {
  constructor(
    private readonly lostInfoService: LostInfoService,
    private readonly petService: PetService,
  ) {}

  @Post(':petId')
  @UseGuards(AuthGuard)
  async create(
    @Req() req: Request,
    @Param('petId', ParseIntPipe) petId: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateLostInfoDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [, petErr] = await this.petService.findOne({
      where: { id: petId, userId: tokenDecoded.sub },
    });

    if (petErr) throw petErr;

    const [lostInfo, err] = await this.lostInfoService.create({
      data: { ...data, pet: { connect: { id: petId } } },
    });

    if (err) throw err;
    return lostInfo;
  }

  @Patch(':petId')
  @UseGuards(AuthGuard)
  async update(
    @Req() req: Request,
    @Param('petId', ParseIntPipe) petId: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateLostInfoDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [lostInfo, err] = await this.lostInfoService.update({
      where: { petId },
      data,
    });

    if (err) throw err;
    return lostInfo;
  }

  @Delete(':petId')
  @UseGuards(AuthGuard)
  async delete(
    @Req() req: Request,
    @Param('petId', ParseIntPipe) petId: number,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [, err] = await this.lostInfoService.delete({
      where: { petId, pet: { userId: tokenDecoded.sub } },
    });
    if (err) throw err;
  }
}
