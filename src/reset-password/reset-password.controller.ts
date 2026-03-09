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
import { ResetPasswordService } from './reset-password.service';

import { ResetPasswordUrlDto } from './dto/reset-password-url.dto';

import { join } from 'node:path';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Post('generate-url')
  async generate(
    @Req() request: Request,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: ResetPasswordUrlDto,
  ) {
    const origin = request.headers.origin;
    if (!origin) throw new BadRequestException('Origin not found');

    const [resetPasswordData, err] = await this.resetPasswordService.generate(
      data.email,
    );

    if (err) throw err;

    const resetUrl = new URL(
      join('reset-password', resetPasswordData.pageId),
      origin,
    );

    const [, upsertErr] =
      await this.resetPasswordService.upsert(resetPasswordData);
    if (upsertErr) throw upsertErr;

    await this.mailerService.sendResetPasswordUrl({
      to: resetPasswordData.email,
      url: resetUrl,
      expiresIn: this.resetPasswordService.verifyExpiresIn,
    });
  }
}
