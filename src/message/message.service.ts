import type { Prisma, Message } from 'prisma/generated/prisma/client';
import type { ReturnWithErrPromise } from '@type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async count({
    where,
  }: {
    where?: Prisma.MessageWhereInput;
  } = {}): ReturnWithErrPromise<number> {
    try {
      const total = await this.prisma.message.count({ where });
      return [total, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findOne({
    where,
  }: {
    where: Prisma.MessageWhereUniqueInput;
  }): ReturnWithErrPromise<Message> {
    try {
      const message = await this.prisma.message.findUnique({ where });
      if (!message) throw new NotFoundException('Message not found');
      return [message, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
  }: {
    where?: Prisma.MessageWhereInput;
  } = {}): ReturnWithErrPromise<Message[]> {
    try {
      const messages = await this.prisma.message.findMany({ where });
      return [messages, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
  }: {
    data: Prisma.MessageCreateInput;
  }): ReturnWithErrPromise<Message> {
    try {
      const message = await this.prisma.message.create({ data });
      return [message, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update({
    where,
    data,
  }: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }): ReturnWithErrPromise<Message> {
    try {
      const message = await this.prisma.message.update({ where, data });
      return [message, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
  }: {
    where: Prisma.MessageWhereUniqueInput;
  }): ReturnWithErrPromise<Message> {
    try {
      const message = await this.prisma.message.delete({ where });
      return [message, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
