import type { Request } from 'express';

import {
  Controller,
  Post,
  Req,
  Body,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

import { MailerService } from 'src/mailer/mailer.service';
import { PasswordService } from './password.service';

import { ResetPasswordUrlDto } from './dto/reset-password-url.dto';
import { CheckPasswordUrlDto } from './dto/check-password-url.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { join } from 'node:path';

@Controller('reset-password')
export class PasswordController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('send-url')
  async send(
    @Req() request: Request,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: ResetPasswordUrlDto,
  ) {
    const referer = request.headers.origin ?? request.headers.referer;
    if (!referer) throw new BadRequestException('Referer not found');

    const [resetPasswordData, err] =
      await this.passwordService.generateResetUrl(data.email);

    if (err) throw err;

    const [resetData, upsertErr] =
      await this.passwordService.upsertResetPageId(resetPasswordData);
    if (upsertErr) throw upsertErr;

    const resetUrl = new URL(
      join('reset-password', resetData.pageId),
      new URL(referer).origin,
    );

    await this.mailerService.sendResetPasswordUrl({
      to: resetData.email,
      url: resetUrl,
      expiresIn: this.passwordService.verifyExpiresIn,
    });
  }

  @Post('check-url')
  async checkUrl(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CheckPasswordUrlDto,
  ) {
    const [, err] = await this.passwordService.checkResetPageId(data.pageId);
    if (err) throw err;
  }

  @Post('reset')
  async reset(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: ResetPasswordDto,
  ) {
    const [resetData, err] = await this.passwordService.checkResetPageId(
      data.pageId,
    );

    if (err) throw err;

    const [, resetErr] = await this.passwordService.resetPassword(
      resetData,
      data.password,
    );

    if (resetErr) throw resetErr;
  }
}
