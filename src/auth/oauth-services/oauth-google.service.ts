import type { ConfigType } from '@nestjs/config';
import type {
  ReturnWithErr,
  ReturnWithErrPromise,
} from '@type/return-with-err.type';
import type {
  OAuthGoogleToken,
  OAuthGoogleTokenDecoded,
} from '../type/oauth-google.type';

import { Injectable, Inject, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { stringify } from 'node:querystring';

import { GoogleCallbackDto } from '../dto/google-callback.dto';
import oauthGoogleConfig from '../config/oauth-google.config';
import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class OAuthGoogleService {
  private readonly authEndpoint =
    'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly tokenEndpoint = 'https://oauth2.googleapis.com/token';

  constructor(
    @Inject(oauthGoogleConfig.KEY)
    private readonly config: ConfigType<typeof oauthGoogleConfig>,
    private readonly jwtService: JwtService,
  ) {}

  generateAuthUrl(): ReturnWithErr<string> {
    try {
      const params = {
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        response_type: this.config.responseType,
        scope: this.config.scope.join(' '),
      };

      const url = `${this.authEndpoint}?${stringify(params)}`;
      return [url, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async authCallback({
    code,
  }: GoogleCallbackDto): ReturnWithErrPromise<OAuthGoogleTokenDecoded> {
    try {
      const params = {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        grant_type: this.config.grantType,
        code,
      };

      const endpoint = `${this.tokenEndpoint}?${stringify(params)}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-from-urlencoded' },
      });

      if (response.status !== 200) {
        throw new HttpException(response.statusText, response.status);
      }

      const data = <OAuthGoogleToken>await response.json();
      const decodedUserData = this.jwtService.decode<OAuthGoogleTokenDecoded>(
        data.id_token,
      );

      return [decodedUserData, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
