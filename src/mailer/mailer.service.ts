import type { ReturnWithErrPromise } from '@type/return-with-err.type';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import type { SendMailOptions } from 'nodemailer';
import type { Duration } from 'dayjs/plugin/duration';

import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class MailerService {
  private readonly websiteName = process.env.PROJECT_NAME;

  private readonly transporter = createTransport({
    host: 'smtp.gmail.com',
    // port: 587,
    // secure: false,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_LOGIN,
      pass: process.env.MAILER_APP_PASSWORD,
    },
  });

  async send(
    data: Omit<SendMailOptions, 'from'>,
  ): ReturnWithErrPromise<SentMessageInfo> {
    try {
      const mailInfo = await this.transporter.sendMail({
        from: `"${this.websiteName}" <${process.env.MAILER_LOGIN}>`,
        ...data,
      });

      return [mailInfo, null];
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
  }): ReturnWithErrPromise<SentMessageInfo> {
    try {
      const expInMin = expiresIn.asMinutes();

      const [mailInfo, err] = await this.send({
        to,
        subject: `Код подтверджения: ${code}`,
        text: `Приветствуем! Введите этот код на странице подтверждения, чтобы завершить регистрацию в ${this.websiteName}. ${code} Код действителен в течение ${expInMin} минут.`,
        html: `<h2>Приветствуем!</h2><p>Введите этот код на странице подтверждения, чтобы завершить регистрацию в ${this.websiteName}.</p> <h1>${code}</h1><p>Код действителен в течение ${expInMin} минут.</p>`,
      });

      if (err) throw err;

      return [mailInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async sendResetPasswordUrl({
    to,
    url,
    expiresIn,
  }: {
    to: string;
    url: URL;
    expiresIn: Duration;
  }): ReturnWithErrPromise<SentMessageInfo> {
    try {
      const expInMin = expiresIn.asMinutes();

      const [mailInfo, err] = await this.send({
        to,
        subject: `Восстановление пароля`,
        text: `Приветствуем! Перейдите по ссылке ниже для восстановления пароля на сайте ${this.websiteName}. Ссылка действителен в течение ${expInMin} минут. ${url.href}`,
        html: `<h2>Приветствуем!</h2><p>Перейдите по ссылке ниже для восстановления пароля на сайте ${this.websiteName}.</p><p>Ссылка действителен в течение ${expInMin} минут.</p> <a href=${url.href} target="_blank">${url.href}</a>`,
      });

      if (err) throw err;

      return [mailInfo, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
