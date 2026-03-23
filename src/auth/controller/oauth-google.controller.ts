import type { Request } from 'express';
import type { Tokens } from 'src/token/token.type';

import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthType } from 'prisma/generated/prisma/enums';

import { AuthService } from '../service/auth.service';
import { OAuthGoogleService } from '../service/oauth-google.service';
import { UserService } from 'src/user/user.service';

import { GoogleCallbackDto } from '../dto/google-callback.dto';

const tokenExample: Tokens = {
  accessToken: 'your.access.token',
  refreshToken: 'your.refresh.token',
};

@Controller('auth/google')
export class OAuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthGoogleService: OAuthGoogleService,
    private readonly userService: UserService,
  ) {}

  @Get('url')
  @ApiResponse({
    status: 200,
    example: { url: 'https://accounts.google.com/o/oauth2/v2/auth' },
  })
  googleUrl(@Req() request: Request) {
    const referer = request.headers.origin ?? request.headers.referer;
    if (!referer) throw new BadRequestException('Referer not found');

    const [url, err] = this.oauthGoogleService.generateAuthUrl(
      new URL(referer).origin,
    );

    if (err) throw err;
    return { url };
  }

  @Post('callback')
  @HttpCode(200)
  @ApiResponse({ example: tokenExample, status: 200 })
  async googleCallback(
    @Req() request: Request,
    @Body(new ValidationPipe({ whitelist: true })) body: GoogleCallbackDto,
  ) {
    const referer = request.headers.origin ?? request.headers.referer;
    if (!referer) throw new BadRequestException('Referer not found');

    const origin = new URL(referer).origin;

    const [decodedUser, decodeErr] = await this.oauthGoogleService.authCallback(
      body.code,
      origin,
    );

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

    if (origin?.includes('admin') && user?.role !== 'Admin') {
      throw new ForbiddenException();
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
}
