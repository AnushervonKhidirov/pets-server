import type { ReturnWithErrPromise } from '@type/return-with-err.type';
import type { Tokens } from 'src/token/token.type';
import { Prisma, AuthType } from 'prisma/generated/prisma/client';

import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutDto } from './dto/sign-out.dto';

import { hash, compare } from 'bcryptjs';
import { exceptionHandler } from '@helper/exception.helper';
import { User } from 'prisma/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUpWithPassword(
    userData: CreateUserDto,
  ): ReturnWithErrPromise<Tokens> {
    try {
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

  async signOut({ refreshToken }: SignOutDto): ReturnWithErrPromise<null> {
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

  async signOutEverywhere({
    refreshToken,
  }: SignOutDto): ReturnWithErrPromise<null> {
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

  private async generateToken(
    user: Readonly<User>,
  ): ReturnWithErrPromise<Tokens> {
    try {
      const [tokens, tokenErr] = await this.tokenService.generate({
        sub: user.id,
        email: user.email,
      });

      if (tokenErr) throw tokenErr;

      const [, saveTokenErr] = await this.tokenService.save(
        user.id,
        tokens.refreshToken,
      );

      if (saveTokenErr) throw saveTokenErr;

      return [tokens, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
