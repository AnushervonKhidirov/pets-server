import type { Tokens } from 'src/token/token.type';

import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { OAuthGoogleService } from './oauth-services/oauth-google.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutDto } from './dto/sign-out.dto';
import { GoogleCallbackDto } from './dto/google-callback.dto';

const tokenExample: Tokens = {
  accessToken: 'your.access.token',
  refreshToken: 'your.refresh.token',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthGoogleService: OAuthGoogleService,
  ) {}

  @Post('google/url')
  googleUrl() {
    const [url, err] = this.oauthGoogleService.generateAuthUrl();
    if (err) throw err;
    return url;
  }

  @Post('google/callback')
  async googleCallback(@Body(new ValidationPipe()) body: GoogleCallbackDto) {
    const [decodedUser, err] = await this.oauthGoogleService.authCallback(body);
    if (err) throw err;
    return decodedUser;
  }

  @Post('sign-up')
  @HttpCode(200)
  @ApiResponse({ example: tokenExample })
  async signUp(
    @Body(new ValidationPipe({ transform: true })) data: CreateUserDto,
  ) {
    const [token, err] = await this.authService.signUp(data);
    if (err) throw err;
    return token;
  }

  @Post('sign-in')
  @ApiResponse({ example: tokenExample })
  @HttpCode(200)
  async signIn(@Body(new ValidationPipe({ transform: true })) data: SignInDto) {
    const [token, err] = await this.authService.signIn(data);
    if (err) throw err;
    return token;
  }

  @Post('sign-out')
  @HttpCode(200)
  async signOut(@Body(new ValidationPipe()) data: SignOutDto) {
    const [, err] = await this.authService.signOut(data);
    if (err) throw err;
  }

  @Post('sign-out-everywhere')
  @HttpCode(200)
  async signOutEverywhere(@Body(new ValidationPipe()) data: SignOutDto) {
    const [, err] = await this.authService.signOutEverywhere(data);
    if (err) throw err;
  }
}
