import type { Tokens } from 'src/token/token.type';

import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthType } from 'prisma/generated/prisma/enums';

import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { OAuthGoogleService } from './oauth-services/oauth-google.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutDto } from './dto/sign-out.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleCallbackDto } from './dto/google-callback.dto';

const tokenExample: Tokens = {
  accessToken: 'your.access.token',
  refreshToken: 'your.refresh.token',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly oauthGoogleService: OAuthGoogleService,
  ) {}

  @Get('google/url')
  @ApiResponse({
    status: 200,
    example: { url: 'https://accounts.google.com/o/oauth2/v2/auth' },
  })
  googleUrl() {
    const [url, err] = this.oauthGoogleService.generateAuthUrl();
    if (err) throw err;
    return { url };
  }

  @Post('google/callback')
  @HttpCode(200)
  @ApiResponse({ example: tokenExample, status: 200 })
  async googleCallback(
    @Body(new ValidationPipe({ whitelist: true })) body: GoogleCallbackDto,
  ) {
    const [decodedUser, decodeErr] =
      await this.oauthGoogleService.authCallback(body);
    if (decodeErr) throw decodeErr;

    const [user, userErr] = await this.userService.findOne({
      where: { email: decodedUser.email },
    });

    if (
      userErr !== null &&
      userErr.getStatus() !== (HttpStatus.NOT_FOUND as number)
    ) {
      throw userErr;
    }

    if (user) {
      const [token, err] = await this.authService.signInOAuth({
        email: decodedUser.email,
        authType: AuthType.Google,
      });

      if (err) throw err;
      return token;
    }

    const [token, err] = await this.authService.signUpOAuth({
      email: decodedUser.email,
      firstName: decodedUser.given_name,
      lastName: decodedUser.family_name,
      avatar: decodedUser.picture,
      authType: AuthType.Google,
    });

    if (err) throw err;

    return token;
  }

  @Post('sign-up')
  @HttpCode(200)
  @ApiResponse({ example: tokenExample, status: 200 })
  async signUp(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateUserDto,
  ) {
    const [token, err] = await this.authService.signUpWithPassword(data);
    if (err) throw err;
    return token;
  }

  @Post('sign-in')
  @HttpCode(200)
  @ApiResponse({ example: tokenExample, status: 200 })
  async signIn(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: SignInDto,
  ) {
    const [token, err] = await this.authService.signInWithPassword(data);
    if (err) throw err;
    return token;
  }

  @Post('sign-out')
  @HttpCode(200)
  async signOut(
    @Body(new ValidationPipe({ whitelist: true })) data: SignOutDto,
  ) {
    const [, err] = await this.authService.signOut(data);
    if (err) throw err;
  }

  @Post('sign-out-everywhere')
  @HttpCode(200)
  async signOutEverywhere(
    @Body(new ValidationPipe({ whitelist: true })) data: SignOutDto,
  ) {
    const [, err] = await this.authService.signOutEverywhere(data);
    if (err) throw err;
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Body(new ValidationPipe({ whitelist: true })) data: RefreshTokenDto,
  ) {
    const [token, err] = await this.authService.refreshToken(data);
    if (err) throw err;
    return token;
  }
}
