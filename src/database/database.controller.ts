import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['Admin'])
  @Get('backup')
  async create() {
    const [dump, err] = await this.databaseService.backup();
    if (err) throw err;
    return dump;
  }
}
