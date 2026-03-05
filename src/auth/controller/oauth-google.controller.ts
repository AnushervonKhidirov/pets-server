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
  googleUrl() {
    const [url, err] = this.oauthGoogleService.generateAuthUrl();
    if (err) throw err;
    return { url };
  }

  @Post('callback')
  @HttpCode(200)
  @ApiResponse({ example: tokenExample, status: 200 })
  async googleCallback(
    @Body(new ValidationPipe({ whitelist: true })) body: GoogleCallbackDto,
  ) {
    const [decodedUser, decodeErr] =
      await this.oauthGoogleService.authCallback(body);
    if (decodeErr) throw decodeErr;

    console.log(decodeErr);

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
}
