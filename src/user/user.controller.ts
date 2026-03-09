import type { Request } from 'express';
import type { Prisma } from 'prisma/generated/prisma/client';
import { AuthType } from 'prisma/generated/prisma/client';
import type { TokenDecoded } from 'src/token/token.type';

import {
  Controller,
  Get,
  Delete,
  Patch,
  Req,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const userOmit: Prisma.UserOmit = {
  password: true,
  createdAt: true,
  updatedAt: true,
  role: true,
};

const userInclude: Prisma.UserInclude = {
  address: { omit: { userId: true } },
};

const userExample1 = {
  id: 1,
  authType: AuthType.Google,
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
    address: 'some address, appartment number',
    latitude: 40.4123124123,
    longitude: 90.4123124123,
  },
};

const userExample2 = {
  id: 2,
  authType: AuthType.Local,
  email: 'your_email2@gmail.com',
  phone: '+992715303257',
  firstName: 'firstName',
  lastName: null,
  contacts: null,
  address: null,
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    examples: {
      user_1: { summary: 'Full data', value: userExample1 },
      user_2: { summary: 'Not full', value: userExample2 },
    },
    status: 200,
  })
  @UseGuards(AuthGuard)
  @Get('me')
  async findMe(@Req() req: Request) {
    const { sub } = this.getUserFromRequest(req);

    const [user, err] = await this.userService.findOne({
      where: { id: sub },
      omit: userOmit,
      include: userInclude,
    });

    if (err) throw err;
    return user;
  }

  @ApiResponse({
    example: [userExample1, userExample2],
    status: 200,
  })
  @Get()
  async findMany() {
    const [users, err] = await this.userService.findMany({
      omit: userOmit,
      include: userInclude,
    });
    if (err) throw err;
    return users;
  }

  @ApiResponse({
    examples: {
      user_1: { summary: 'Full data', value: userExample1 },
      user_2: { summary: 'Not full', value: userExample2 },
    },
    status: 200,
  })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [user, err] = await this.userService.findOne({
      where: { id },
      omit: userOmit,
      include: userInclude,
    });

    if (err) throw err;
    return user;
  }

  @ApiResponse({
    examples: {
      user_1: { summary: 'Full data', value: userExample1 },
      user_2: { summary: 'Not full', value: userExample2 },
    },
    status: 200,
  })
  @UseGuards(AuthGuard)
  @Patch()
  async update(
    @Req() req: Request,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateUserDto,
  ) {
    const { sub } = this.getUserFromRequest(req);

    const [user, err] = await this.userService.update(
      {
        where: { id: sub },
        data,
        omit: userOmit,
        include: userInclude,
      },
      sub,
    );

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: Request,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: ChangePasswordDto,
  ) {
    const { sub } = this.getUserFromRequest(req);
    const [, err] = await this.userService.changePassword(sub, data);
    if (err) throw err;
  }

  @ApiResponse({
    examples: {
      user_1: { summary: 'Full data', value: userExample1 },
      user_2: { summary: 'Not full', value: userExample2 },
    },
    status: 200,
  })
  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Req() req: Request) {
    const { sub } = this.getUserFromRequest(req);

    const [user, err] = await this.userService.delete({
      where: { id: sub },
      omit: userOmit,
      include: userInclude,
    });

    if (err) throw err;
    return user;
  }

  private getUserFromRequest(req: Request) {
    const tokenDecoded = req['user'] as TokenDecoded | undefined;
    if (!tokenDecoded) throw new UnauthorizedException();
    return tokenDecoded;
  }
}
