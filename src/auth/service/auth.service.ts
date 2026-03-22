import type { ReturnWithErrPromise } from '@type/return-with-err.type';
import type { Tokens } from 'src/token/token.type';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import type { Prisma, User } from 'prisma/generated/prisma/client';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthType } from 'prisma/generated/prisma/client';

import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { MailerService } from 'src/mailer/mailer.service';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';
import { PasswordService } from 'src/reset-password/password.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignOutDto } from '../dto/sign-out.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly passwordService: PasswordService,
  ) {}

  async verifyEmail(email: string): ReturnWithErrPromise<SentMessageInfo> {
    try {
      const { code, expiredAt } = this.verificationCodeService.generate();

      const [mailInfo, err] = await this.mailerService.sendVerificationCode({
        to: email,
        code,
        expiresIn: this.verificationCodeService.verifyExpiresIn,
      });

      if (err) throw err;

      await this.verificationCodeService.upsert({ email, code, expiredAt });

      return [mailInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signUpWithPassword({
    code,
    ...userData
  }: CreateUserDto): ReturnWithErrPromise<Tokens> {
    try {
      await this.verificationCodeService.verify({
        email: userData.email,
        code,
      });

      const hashPassword = await this.passwordService.hash(userData.password);

      const [user, userErr] = await this.userService.create({
        data: {
          ...userData,
          password: hashPassword,
          authType: AuthType.Local,
        },
        omit: { password: true },
      });

      if (userErr) throw userErr;

      await this.verificationCodeService.delete({ email: userData.email });

      const [tokens, tokenErr] = await this.generateToken(user);
      if (tokenErr) throw tokenErr;

      return [tokens, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signInWithPassword(
    signInDto: SignInDto,
    origin?: string,
  ): ReturnWithErrPromise<Tokens> {
    try {
      const [user, userErr] = await this.userService.findOne({
        where: { email: signInDto.email },
      });

      if (userErr) throw userErr;

      if (!user.password) {
        throw new BadRequestException(
          "You don't have password, please contact with support team",
        );
      }

      await this.passwordService.compare(signInDto.password, user.password);

      if (origin?.includes('admin') && user.role !== 'Admin') {
        throw new ForbiddenException();
      }

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
