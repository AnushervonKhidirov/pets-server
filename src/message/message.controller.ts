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
} from '@nestjs/common';

import { MessageService } from './message.service';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { QueryMessageDto } from './dto/query-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [message, err] = await this.messageService.findOne({ where: { id } });
    if (err) throw err;
    return message;
  }

  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryMessageDto,
  ) {
    const [messages, err] = await this.messageService.findMany({
      where: query,
    });
    if (err) throw err;
    return messages;
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: CreateMessageDto,
  ) {
    const [messages, err] = await this.messageService.create({ data });
    if (err) throw err;
    return messages;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateMessageDto,
  ) {
    const [messages, err] = await this.messageService.update({
      where: { id },
      data,
    });
    if (err) throw err;
    return messages;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [, err] = await this.messageService.delete({
      where: { id },
    });
    if (err) throw err;
  }
}
