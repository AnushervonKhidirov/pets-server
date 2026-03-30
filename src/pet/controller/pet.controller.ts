import type { Request } from 'express';
import type {
  Pet,
  Breed,
  PetType,
  Prisma,
  User,
} from 'prisma/generated/prisma/client';
import type { TokenDecoded } from 'src/token/token.type';

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
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

import { PetService } from '../service/pet.service';
import { S3Storage } from 'src/storage/storage.service';

import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';
import { QueryPetDto, SearchQueryPetDto } from '../dto/query-pet.dto';

import { extension } from 'mime-types';

const petExample: Pet & { breed: Breed; petType: PetType } = {
  id: 1,
  uuid: '2de16ba8-5730-4899-88fa-832422600dc6',
  name: 'Фобос',
  about: 'Хитрожопая скотина',
  sex: 'Male',
  birthday: new Date('2021-07-01T19:00:00.000Z'),
  microchipId: '00433555635422',
  petTypeId: 1,
  breedId: 147,
  image: 'pet-1',
  lost: false,
  hadFound: false,
  hadLost: false,
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
    country: {
      id: 1,
      en: 'Country',
      ru: 'Страна',
    },
    city: {
      id: 1,
      countryId: 1,
      en: 'City',
      ru: 'Город',
    },
    countryId: 1,
    cityId: 1,
    address: 'some address, appartment number',
    latitude: 40.4123124123,
    longitude: 90.4123124123,
  },
};

const petInclude: Prisma.PetInclude = {
  lostInfo: true,
  breed: true,
  petType: true,
};

const petUserInclude: Prisma.PetInclude = {
  user: {
    omit: {
      password: true,
      authType: true,
      createdAt: true,
      updatedAt: true,
    },
    include: {
      address: {
        omit: { userId: true },
        include: { country: true, city: true },
      },
    },
  },
};

function removeSensitiveInfo(pet: Pet & { user?: User }) {
  if (pet.lost) return pet;
  if (!('user' in pet)) return pet;

  const user = pet.user as User;

  return {
    ...pet,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    },
  };
}

@Controller('pet')
export class PetController {
  private readonly storageFolder = 'pet-images';

  constructor(
    private readonly petService: PetService,
    private readonly s3Storage: S3Storage,
  ) {}

  @ApiResponse({ example: petExample })
  @UseGuards(AuthGuard)
  @Get('my/:id')
  async findMyOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [pet, err] = await this.petService.findOne({
      where: { id, userId: tokenDecoded.sub },
      include: petInclude,
    });
    if (err) throw err;
    return pet;
  }

  @ApiResponse({ example: petExample })
  @UseGuards(AuthGuard)
  @Get('my')
  async findMyMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    where: QueryPetDto,
    @Req() req: Request,
  ) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();

    const [data, err] = await this.petService.findMany({
      where: {
        ...where,
        userId: tokenDecoded.sub,
      },
      include: petInclude,
    });
    if (err) throw err;

    const [total, countErr] = await this.petService.count({
      where: {
        ...where,
        userId: tokenDecoded.sub,
      },
    });

    if (countErr) throw countErr;

    return { data, total };
  }

  @ApiResponse({
    example: {
      data: [removeSensitiveInfo({ ...petExample, user: userExample as any })],
      total: 1,
    },
    description:
      'Sensitive user info (filed: phone, email, contacts, address) will show only when pet is lost',
  })
  @Get('search')
  async findManyWithSearch(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: SearchQueryPetDto,
  ) {
    const { skip, take, name, microchipId, ...whereQuery } = query;

    const where = {
      ...whereQuery,
      OR:
        name || microchipId
          ? [
              { name: { contains: name } },
              { microchipId: { contains: microchipId } },
            ]
          : undefined,
    };

    const [data, err] = await this.petService.findMany({
      where,
      include: { ...petInclude, ...petUserInclude },
      skip,
      take,
    });

    if (err) throw err;

    const [total, countErr] = await this.petService.count({ where });
    if (countErr) throw countErr;

    return {
      data: data.map((pet) => removeSensitiveInfo(pet)),
      total,
    };
  }

  @ApiResponse({
    example: { ...petExample, user: userExample },
    description:
      'Sensitive user info (filed: phone, email, contacts, address) will show only when pet is lost',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [pet, err] = await this.petService.findOne({
      where: { id },
      include: { ...petInclude, ...petUserInclude },
    });

    if (err) throw err;
    return removeSensitiveInfo(pet);
  }

  @ApiResponse({
    example: {
      data: [{ ...petExample, user: userExample as any }],
      total: 1,
    },
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: SearchQueryPetDto,
  ) {
    const { skip, take, ...whereQuery } = query;

    const where = {
      userId: whereQuery.userId,
      user: { email: { contains: whereQuery.userEmail } },
      petTypeId: whereQuery.petTypeId,
      breedId: whereQuery.breedId,
      uuid: whereQuery.uuid,
      sex: whereQuery.sex,
      lost: whereQuery.lost,
      name: { contains: whereQuery.name },
      microchipId: { contains: whereQuery.microchipId },
    };

    const [data, err] = await this.petService.findMany({
      where,
      include: {
        ...petInclude,
        user: {
          select: { email: true, phone: true, firstName: true, lastName: true },
        },
      },
      skip,
      take,
    });

    if (err) throw err;

    const [total, countErr] = await this.petService.count({ where });
    if (countErr) throw countErr;

    return { data, total };
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

  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard)
  @Post('image/:petId')
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

    const filename = `${pet.uuid}.${extension(file.mimetype)}`;

    await this.s3Storage.upload(file, this.storageFolder, filename);

    const [, updateErr] = await this.petService.update({
      where: { id: petId, userId: tokenDecoded.sub },
      data: { image: filename },
    });

    if (updateErr) throw updateErr;
    return { image: filename };
  }

  @Get('image/:filename')
  async getImage(@Param('filename') filename: string) {
    const [file, err] = await this.s3Storage.get(this.storageFolder, filename);

    if (err) throw err;
    return file;
  }

  @UseGuards(AuthGuard)
  @Delete('image/:petId')
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
      await this.s3Storage.delete(this.storageFolder, pet.image);
    }
  }
}
