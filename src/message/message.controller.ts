import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

import { MessageService } from './message.service';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { QueryMessageDto } from './dto/query-message.dto';

const messages = [
  {
    id: 1,
    topic: 'some topic 1',
    phone: '+992715303256',
    message: 'some message 1',
    watched: false,
  },
  {
    id: 2,
    topic: 'some topic 2',
    phone: '+992715303254',
    message: 'some message 2',
    watched: true,
  },
];

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiResponse({ example: messages[0] })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [message, err] = await this.messageService.findOne({ where: { id } });
    if (err) throw err;
    return message;
  }

  @ApiResponse({ example: { data: messages, total: messages.length } })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    where: QueryMessageDto,
  ) {
    const [data, err] = await this.messageService.findMany({ where });
    if (err) throw err;

    const [total, countErr] = await this.messageService.count({ where });
    if (countErr) throw countErr;

    return { data, total };
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateMessageDto,
  ) {
    const [, err] = await this.messageService.create({ data });
    if (err) throw err;
  }

  @ApiResponse({ example: messages })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateMessageDto,
  ) {
    const [message, err] = await this.messageService.update({
      where: { id },
      data,
    });
    if (err) throw err;
    return message;
  }

  @ApiResponse({ example: messages })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [message, err] = await this.messageService.delete({
      where: { id },
    });
    if (err) throw err;
    return message;
  }
}
