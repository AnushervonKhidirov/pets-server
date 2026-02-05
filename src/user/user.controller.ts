import type { Request } from 'express';
import type { UserOmit } from 'prisma/generated/prisma/models';
import type { TokenDecoded } from 'src/token/token.type';

import {
  Controller,
  Get,
  Delete,
  Req,
  Param,
  UseGuards,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';

const userOmit: UserOmit = {
  password: true,
  createdAt: true,
  updatedAt: true,
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async findMe(@Req() req: Request) {
    const { sub } = this.getUserFromRequest(req);

    const [user, err] = await this.userService.findOne({
      where: { id: sub },
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @Get()
  async findMany() {
    const [users, err] = await this.userService.findMany({ omit: userOmit });
    if (err) throw err;
    return users;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [user, err] = await this.userService.findOne({
      where: { id },
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @Delete()
  async delete(@Req() req: Request) {
    const { sub } = this.getUserFromRequest(req);

    const [user, err] = await this.userService.delete({
      where: { id: sub },
      omit: userOmit,
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
