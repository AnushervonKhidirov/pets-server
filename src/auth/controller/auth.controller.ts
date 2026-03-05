import type { Tokens } from 'src/token/token.type';

import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthService } from '../service/auth.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignOutDto } from '../dto/sign-out.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

const tokenExample: Tokens = {
  accessToken: 'your.access.token',
  refreshToken: 'your.refresh.token',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: SignInDto,
  ) {
    const [token, err] = await this.authService.signInWithPassword(data);
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
