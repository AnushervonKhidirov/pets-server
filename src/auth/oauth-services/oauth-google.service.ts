import type { ConfigType } from '@nestjs/config';
import type {
  ReturnWithErr,
  ReturnWithErrPromise,
} from '@type/return-with-err.type';

import { Injectable, Inject, HttpException } from '@nestjs/common';
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
  ) {}

  generateAuthUrl(): ReturnWithErr<string> {
    try {
      const params = {
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        response_type: 'code',
        scope: ['profile', 'email', 'openid'].join(' '),
        access_type: 'offline',
      };

      const url = `${this.authEndpoint}?${stringify(params)}`;
      return [url, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async authCallback({ code }: GoogleCallbackDto): ReturnWithErrPromise<any> {
    try {
      const params = {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        grant_type: 'authorization_code',
        code,
      };

      const endpoint = `${this.tokenEndpoint}?${stringify(params)}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-from-urlencoded',
        },
      });

      console.log(response);

      if (response.status !== 200) {
        throw new HttpException(response.statusText, response.status);
      }

      const tokens = await response.json();

      return [tokens, null];
    } catch (err) {
      console.log(err);

      return exceptionHandler(err);
    }
  }
}
