import type { ReturnWithErrPromise } from '@type/return-with-err.type';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import type { SendMailOptions } from 'nodemailer';
import type { Duration } from 'dayjs/plugin/duration';

import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class MailerService {
  private readonly websiteName = 'Homepaw';

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
        from: `"${this.websiteName}" <${process.env.MAILER_LOGIN}>`,
        ...data,
      });

      return [mail, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async sendVerificationCode({
    to,
    code,
    expiresIn,
  }: {
    to: string;
    code: string;
    expiresIn: Duration;
  }) {
    const expInMin = expiresIn.asMinutes();

    const [, err] = await this.send({
      to,
      subject: `Ваш код подтверджения: ${code}`,
      text: `Приветствуем! Введите этот код на странице подтверждения, чтобы завершить регистрацию в HomePaw. ${code} Код действителен в течение ${expInMin} минут.`,
      html: `<h2>Приветствуем!</h2><p>Введите этот код на странице подтверждения, чтобы завершить регистрацию в HomePaw.</p> <h1>${code}</h1><p>Код действителен в течение ${expInMin} минут.</p>`,
    });

    if (err) throw err;
  }
}
