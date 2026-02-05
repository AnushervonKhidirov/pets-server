import type { ConfigType } from '@nestjs/config';
import type { Prisma, Token } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';
import type { Tokens, TokenPayload, TokenDecoded } from './token.type';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

import dayjs from 'dayjs';
import tokenConfig from './token.config';
import { exceptionHandler } from '@helper/exception.helper';

const accessExpiresIn = dayjs.duration(30, 'm');
const refreshExpiresIn = dayjs.duration(3, 'd');

@Injectable()
export class TokenService {
  constructor(
    @Inject(tokenConfig.KEY)
    private readonly config: ConfigType<typeof tokenConfig>,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generate(payload: TokenPayload): ReturnWithErrPromise<Tokens> {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.config.accessSecret,
        expiresIn: accessExpiresIn.asSeconds(),
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.config.refreshSecret,
        expiresIn: refreshExpiresIn.asSeconds(),
      });

      return [{ accessToken, refreshToken }, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async save(
    userId: number,
    refreshToken: string,
  ): ReturnWithErrPromise<Token> {
    try {
      const expiredAt = dayjs().add(refreshExpiresIn).toDate();
      const token = await this.prisma.token.create({
        data: { refreshToken, expiredAt, userId },
      });

      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(refreshToken: string): ReturnWithErrPromise<null> {
    try {
      await this.prisma.token.delete({ where: { refreshToken } });
      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteAllUsersToken(userId: number): ReturnWithErrPromise<null> {
    try {
      await this.prisma.token.deleteMany({ where: { userId } });
      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteExpiredTokens(): ReturnWithErrPromise<Prisma.BatchPayload> {
    try {
      const tokens = await this.prisma.token.deleteMany({
        where: { expiredAt: { lte: new Date() } },
      });

      return [tokens, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async verifyAccessToken(
    accessToken: string,
  ): ReturnWithErrPromise<TokenDecoded> {
    try {
      const decoded = await this.jwtService.verifyAsync<TokenDecoded>(
        accessToken,
        { secret: this.config.accessSecret },
      );

      return [decoded, null];
    } catch (err) {
      return exceptionHandler(this.tokenErrorsToHttpException(err));
    }
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): ReturnWithErrPromise<TokenDecoded> {
    try {
      const decoded = await this.jwtService.verifyAsync<TokenDecoded>(
        refreshToken,
        {
          secret: this.config.refreshSecret,
        },
      );

      return [decoded, null];
    } catch (err) {
      return exceptionHandler(this.tokenErrorsToHttpException(err));
    }
  }

  private tokenErrorsToHttpException(err: unknown) {
    if (err && typeof err === 'object' && 'message' in err) {
      return new UnauthorizedException(err.message);
    }

    return new UnauthorizedException('invalid token');
  }
}
