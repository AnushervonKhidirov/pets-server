import type { ReturnWithErrPromise } from '@type/return-with-err.type';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import type { SendMailOptions } from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class MailerService {
  private readonly transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILER_LOGIN,
      pass: process.env.MAILER_APP_PASSWORD,
    },
  });

  async send(
    data: Omit<SendMailOptions, 'from'>,
  ): ReturnWithErrPromise<SentMessageInfo> {
    try {
      const mail = await this.transporter.sendMail({
        from: `"Homepaw" <${process.env.MAILER_LOGIN}>`,
        ...data,
      });

      return [mail, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
