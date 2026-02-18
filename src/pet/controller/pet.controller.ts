import type { Request, Response } from 'express';
import type { Prisma } from 'prisma/generated/prisma/client';

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseInterceptors,
  Res,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { PetService } from '../service/pet.service';
import { StorageService } from 'src/storage/storage.service';

import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';
import { QueryPetDto } from '../dto/query-pet.dto';
import { TokenDecoded } from 'src/token/token.type';

const petExample = [];

const petOmit: Prisma.PetsOmit = {
  userId: true,
};

const petInclude: Prisma.PetsInclude = {
  breed: true,
  petType: true,
  user: {
    select: { email: true, phone: true, firstName: true, address: true },
  },
};

@Controller('pet')
export class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly storageService: StorageService,
  ) {}

  @ApiResponse({ example: petExample[0] })
  @UseGuards(AuthGuard)
  @Get('my')
  async findMy(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    where: QueryPetDto,
    @Req() req: Request,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [petType, err] = await this.petService.findMany({
      where: { ...where, userId: tokenDecoded.sub },
      omit: petOmit,
      include: petInclude,
    });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petExample[0] })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [petType, err] = await this.petService.findOne({
      where: { id },
      omit: petOmit,
      include: petInclude,
    });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petExample })
  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    where: QueryPetDto,
  ) {
    const [petTypes, err] = await this.petService.findMany({
      where,
      omit: petOmit,
      include: petInclude,
    });
    if (err) throw err;
    return petTypes;
  }

  @ApiResponse({ example: petExample[0] })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true })) data: CreatePetDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [petType, err] = await this.petService.create({
      data: { ...data, userId: tokenDecoded.sub },
      omit: petOmit,
      include: petInclude,
    });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petExample[0] })
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) data: UpdatePetDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [petType, err] = await this.petService.update({
      where: { id, userId: tokenDecoded.sub },
      data,
      omit: petOmit,
      include: petInclude,
    });
    if (err) throw err;
    return petType;
  }

  @ApiResponse({ example: petExample[0] })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [petType, err] = await this.petService.delete({
      where: { id, userId: tokenDecoded.sub },
      omit: petOmit,
      include: petInclude,
    });

    if (err) throw err;
    return petType;
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard)
  async setImage(
    @Req() req: Request,
    @Query('petId', ParseIntPipe) petId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [pet, err] = await this.petService.findOne({
      where: { id: petId, userId: tokenDecoded.sub },
    });

    if (err) throw err;

    const filename = `pet-${pet.id}`;

    await this.storageService.upload(file, 'pets', filename);

    const [, updateErr] = await this.petService.update({
      where: { id: petId, userId: tokenDecoded.sub },
      data: { image: filename },
    });

    if (updateErr) throw updateErr;
    return { image: filename };
  }

  @Get('image/:filename')
  async getImage(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    await this.storageService.get('pets', filename, response);
  }
}
