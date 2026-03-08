import type { ReturnWithErrPromise } from '@type/return-with-err.type';
import type { Tokens } from 'src/token/token.type';
import type { Prisma, User } from 'prisma/generated/prisma/client';

import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthType } from 'prisma/generated/prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { MailerService } from 'src/mailer/mailer.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignOutDto } from '../dto/sign-out.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

import dayjs from 'dayjs';
import { hash, compare } from 'bcryptjs';
import { exceptionHandler } from '@helper/exception.helper';

const verifyExpiresIn = dayjs.duration(10, 'm');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
  ) {}

  async verifyEmail(email: string): ReturnWithErrPromise {
    try {
      const code = Math.floor(Math.random() * 999_999);
      const websiteName = 'HomePaw';

      const [, err] = await this.mailerService.send({
        to: email,
        subject: `Ваш код подтверджения: ${code}`,
        text: `Приветствуем! Введите этот код на странице подтверждения, чтобы завершить регистрацию в ${websiteName}. ${code} Код действителен в течение ${verifyExpiresIn.asMinutes()} минут.`,
        html: `<h2>Приветствуем!</h2><p>Введите этот код на странице подтверждения, чтобы завершить регистрацию в ${websiteName}.</p> <h1>${code}</h1><p>Код действителен в течение ${verifyExpiresIn.asMinutes()} минут.</p>`,
      });

      if (err) throw err;

      await this.prisma.verifyMail.create({
        data: {
          email,
          code,
          expiredAt: dayjs().add(verifyExpiresIn).toDate(),
        },
      });

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signUpWithPassword({
    code,
    ...userData
  }: CreateUserDto): ReturnWithErrPromise<Tokens> {
    try {
      const verifyData = await this.prisma.verifyMail.findUnique({
        where: { code, email: userData.email },
      });

      if (!verifyData) {
        throw new BadRequestException('Wrong verification code!');
      }

      if (dayjs(verifyData.expiredAt).diff(dayjs()) < 0) {
        throw new BadRequestException('Verification code expired!');
      }

      const hashPassword = await hash(userData.password, 10);

      const [user, userErr] = await this.userService.create({
        data: {
          ...userData,
          password: hashPassword,
          authType: AuthType.Local,
        },
        omit: { password: true },
      });

      if (userErr) throw userErr;

      await this.prisma.verifyMail.delete({ where: { code } });

      const [tokens, tokenErr] = await this.generateToken(user);
      if (tokenErr) throw tokenErr;

      return [tokens, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signInWithPassword(signInDto: SignInDto): ReturnWithErrPromise<Tokens> {
    try {
      const [user, userErr] = await this.userService.findOne({
        where: { email: signInDto.email },
      });

      if (userErr) throw userErr;

      if (!user.password) {
        throw new BadRequestException(
          "You don't password, please contact with support team",
        );
      }

      const isCorrectPassword = await compare(
        signInDto.password,
        user.password,
      );
      if (!isCorrectPassword) throw new BadRequestException('Wrong password');

      const [tokens, tokenErr] = await this.generateToken(user);
      if (tokenErr) throw tokenErr;

      return [tokens, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signUpOAuth(
    userData: Prisma.UserCreateInput,
  ): ReturnWithErrPromise<Tokens> {
    try {
      const [user, userErr] = await this.userService.create({
        data: {
          ...userData,
        },
        omit: { password: true },
      });

      if (userErr) throw userErr;

      const [tokens, tokenErr] = await this.generateToken(user);
      if (tokenErr) throw tokenErr;

      return [tokens, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signInOAuth({
    email,
    authType,
  }: {
    email: string;
    authType: AuthType;
  }): ReturnWithErrPromise<Tokens> {
    try {
      const [user, userErr] = await this.userService.findOne({
        where: { email, authType },
      });

      if (userErr) throw userErr;

      const [tokens, tokenErr] = await this.generateToken(user);
      if (tokenErr) throw tokenErr;

      return [tokens, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signOut({ refreshToken }: SignOutDto): ReturnWithErrPromise {
    try {
      const [, verifyErr] =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (verifyErr) throw verifyErr;

      const [, removeErr] = await this.tokenService.delete(refreshToken);
      if (removeErr) throw removeErr;

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signOutEverywhere({ refreshToken }: SignOutDto): ReturnWithErrPromise {
    try {
      const [decodedToken, verifyErr] =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (verifyErr) throw verifyErr;

      const [, removeErr] = await this.tokenService.deleteAllUsersToken(
        decodedToken.sub,
      );

      if (removeErr) throw removeErr;

      return [null, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): ReturnWithErrPromise<Tokens> {
    try {
      const [decodedToken, verifyErr] =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (verifyErr) throw verifyErr;

      const [, deleteErr] = await this.tokenService.delete(refreshToken);
      if (deleteErr) throw deleteErr;

      const [token, tokenErr] = await this.generateToken({
        id: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken.role,
      });
      if (tokenErr) throw tokenErr;

      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private async generateToken({
    id,
    email,
    role,
  }: Pick<User, 'id' | 'email' | 'role'>): ReturnWithErrPromise<Tokens> {
    try {
      const [tokens, tokenErr] = await this.tokenService.generate({
        sub: id,
        email,
        role,
      });

      if (tokenErr) throw tokenErr;

      const [, saveTokenErr] = await this.tokenService.save(
        id,
        tokens.refreshToken,
      );

      if (saveTokenErr) throw saveTokenErr;

      return [tokens, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
