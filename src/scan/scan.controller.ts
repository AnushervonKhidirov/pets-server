import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';

import { join } from 'node:path';

const redirectUrl = process.env.SCAN_REDIRECT_URL;

@Controller('scan')
export class ScanController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  @Get(':petUUID')
  @Redirect(redirectUrl)
  async scan(@Param('petUUID') petUUID: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { uuid: petUUID },
      select: { id: true, name: true, user: { select: { email: true } } },
    });

    if (!pet) return { url: redirectUrl };

    await this.mailerService.sendScanAction({
      to: pet.user.email,
      petName: pet.name,
    });

    const url = new URL(join('pet', pet.id.toString()), redirectUrl);

    return { url: url.href };
  }
}
