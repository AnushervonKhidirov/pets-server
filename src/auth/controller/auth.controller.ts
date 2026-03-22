import type { Request } from 'express';
import type { Tokens } from 'src/token/token.type';

import {
  Controller,
  Post,
  Body,
  Req,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthService } from '../service/auth.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignOutDto } from '../dto/sign-out.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { UserService } from 'src/user/user.service';

const tokenExample: Tokens = {
  accessToken: 'your.access.token',
  refreshToken: 'your.refresh.token',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('verify-email')
  async verifyEmail(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: VerifyEmailDto,
  ) {
    const [mailInfo, err] = await this.authService.verifyEmail(data.email);
    if (err) throw err;
    return mailInfo;
  }

  @Post('is-email-exist')
  async isEmailExist(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: VerifyEmailDto,
  ) {
    const [user] = await this.userService.findOne({
      where: { email: data.email },
    });

    if (user) {
      throw new BadRequestException('User with this email already exist');
    }
  }

  @ApiResponse({ example: tokenExample, status: 200 })
  @Post('sign-up')
  async signUp(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateUserDto,
  ) {
    const [token, err] = await this.authService.signUpWithPassword(data);
    if (err) throw err;
    return token;
  }

  @ApiResponse({ example: tokenExample, status: 200 })
  @Post('sign-in')
  async signIn(
    @Req() request: Request,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: SignInDto,
  ) {
    const referer = request.headers.origin ?? request.headers.referer;
    const origin = referer ? new URL(referer).origin : undefined;

    const [token, err] = await this.authService.signInWithPassword(
      data,
      origin,
    );
    if (err) throw err;
    return token;
  }

  @Post('sign-out')
  async signOut(
    @Body(new ValidationPipe({ whitelist: true })) data: SignOutDto,
  ) {
    const [, err] = await this.authService.signOut(data);
    if (err) throw err;
  }

  @Post('sign-out-everywhere')
  async signOutEverywhere(
    @Body(new ValidationPipe({ whitelist: true })) data: SignOutDto,
  ) {
    const [, err] = await this.authService.signOutEverywhere(data);
    if (err) throw err;
  }

  @Post('refresh-token')
  async refreshToken(
    @Body(new ValidationPipe({ whitelist: true })) data: RefreshTokenDto,
  ) {
    const [token, err] = await this.authService.refreshToken(data);
    if (err) throw err;
    return token;
  }
}
