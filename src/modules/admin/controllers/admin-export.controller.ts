import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AdminRepository } from '../repositories/admin.repository';
import { streamCsv } from '../../../common/utils/csv.util';

@ApiTags('Admin Export')
@Controller('api/admin/export')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminExportController {
  constructor(private readonly repo: AdminRepository) {}

  @Get('users')
  async users(@Res() res: Response) {
    const users = await this.repo['users'].find().lean();
    streamCsv(res, 'users.csv', ['phone', 'name'], users);
  }

  @Get('vendors')
  async vendors(@Res() res: Response) {
    const vendors = await this.repo['vendors'].find().lean();
    streamCsv(res, 'vendors.csv', ['name', 'specialty', 'whatsapp'], vendors);
  }

  @Get('invites')
  async invites(@Res() res: Response) {
    const invites = await this.repo['invites'].find().lean();
    streamCsv(res, 'invites.csv', ['vendorPhone', 'verified', 'completed'], invites);
  }
}
