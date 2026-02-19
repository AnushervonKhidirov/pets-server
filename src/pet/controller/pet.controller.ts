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

const petExample = {
  id: 1,
  name: 'Фобос',
  about: 'Хитрожопая скотина',
  sex: 'Male',
  birthday: '2021-07-01T19:00:00.000Z',
  microchipId: '00433555635422',
  petTypeId: 1,
  breedId: 147,
  image: 'pet-1',
  lost: false,
  breed: {
    id: 147,
    en: 'European Shorthair',
    ru: 'Европейская короткошерстная',
    petTypeId: 1,
  },
  petType: {
    id: 1,
    en: 'Cat',
    ru: 'Кошка',
  },
  userId: 1,
};

const userExample = {
  id: 1,
  email: 'your_email1@gmail.com',
  phone: '+992715303256',
  firstName: 'firstName',
  lastName: 'lastName',
  avatar: null,
  contacts: [
    { name: 'Telegram', value: '@username' },
    { name: 'WatsApp', value: '@username' },
  ],
  address: {
    id: 1,
    address: 'some address, appartment number',
    latitude: 40.4123124123,
    longitude: 90.4123124123,
  },
};

const petInclude: Prisma.PetsInclude = {
  breed: true,
  petType: true,
};

const petUserInclude: Prisma.PetsInclude = {
  user: {
    omit: {
      password: true,
      authType: true,
      createdAt: true,
      updatedAt: true,
    },
    include: { address: { omit: { userId: true } } },
  },
};

@Controller('pet')
export class PetController {
  private readonly storageFolder = 'pets';

  constructor(
    private readonly petService: PetService,
    private readonly storageService: StorageService,
  ) {}

  @ApiResponse({ example: petExample })
  @UseGuards(AuthGuard)
  @Get('my')
  async findMy(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    where: QueryPetDto,
    @Req() req: Request,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [pet, err] = await this.petService.findMany({
      where: { ...where, userId: tokenDecoded.sub },
      include: petInclude,
    });
    if (err) throw err;
    return pet;
  }

  @ApiResponse({ example: { ...petExample, user: userExample } })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [pet, err] = await this.petService.findOne({
      where: { id },
      include: { ...petInclude, ...petUserInclude },
    });

    if (err) throw err;
    return pet;
  }

  @ApiResponse({ example: [petExample] })
  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    where: QueryPetDto,
  ) {
    const [pets, err] = await this.petService.findMany({
      where,
      include: petInclude,
    });
    if (err) throw err;
    return pets;
  }

  @ApiResponse({ example: petExample })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true })) data: CreatePetDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [pet, err] = await this.petService.create({
      data: { ...data, userId: tokenDecoded.sub },
      include: petInclude,
    });
    if (err) throw err;
    return pet;
  }

  @ApiResponse({ example: petExample })
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) data: UpdatePetDto,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [pet, err] = await this.petService.update({
      where: { id, userId: tokenDecoded.sub },
      data,
      include: petInclude,
    });
    if (err) throw err;
    return pet;
  }

  @ApiResponse({ example: petExample })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [pet, err] = await this.petService.delete({
      where: { id, userId: tokenDecoded.sub },
      include: petInclude,
    });

    if (err) throw err;
    return pet;
  }

  @Post('image/:petId')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard)
  async setImage(
    @Req() req: Request,
    @Param('petId', ParseIntPipe) petId: number,
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

    await this.storageService.upload(file, this.storageFolder, filename);

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
    await this.storageService.get(this.storageFolder, filename, response);
  }

  @Delete('image/:petId')
  @UseGuards(AuthGuard)
  async deleteImage(
    @Req() req: Request,
    @Param('petId', ParseIntPipe) petId: number,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [pet, err] = await this.petService.findOne({
      where: { id: petId, userId: tokenDecoded.sub },
      include: petInclude,
    });

    if (err) throw err;

    const [, updateErr] = await this.petService.update({
      where: { id: petId, userId: tokenDecoded.sub },
      data: { image: null },
      include: petInclude,
    });

    if (updateErr) throw updateErr;

    if (pet.image) {
      await this.storageService.delete(this.storageFolder, pet.image);
    }
  }
}
