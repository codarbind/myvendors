import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';

@ApiTags('Invites')
@Controller('api')
export class InvitesController {
  constructor(private readonly invites: InvitesService) {}

  @Get('users/:userId/invites')
  getUserInvites(@Param('userId') userId: string) {
    return this.invites.getUserInvites(userId);
  }

  @Post('invites')
  @ApiOperation({ summary: 'Create invite' })
  create(@Body() dto: CreateInviteDto) {
    return this.invites.create(dto);
  }

  @Get('invites/:token')
  getByToken(@Param('token') token: string) {
    return this.invites.getByToken(token);
  }

  @Patch('invites/:token')
  update(
    @Param('token') token: string,
    @Body() dto: UpdateInviteDto,
  ) {
    return this.invites.update(token, dto);
  }

  @Patch('invites/:token/complete')
  complete(@Param('token') token: string) {
    return this.invites.complete(token);
  }

  @Delete('invites/:inviteId')
  delete(@Param('inviteId') inviteId: string) {
    return this.invites.delete(inviteId);
  }

  @Get('users/:userId/can-reinvite/:vendorPhone')
  async canReinvite(
    @Param('userId') userId: string,
    @Param('vendorPhone') vendorPhone: string,
  ) {
    const canReinvite = await this.invites.canReinvite(
      userId,
      vendorPhone,
    );
    return { canReinvite };
  }
}
