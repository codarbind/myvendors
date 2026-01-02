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
import { MessageService } from '../messagings/message.service';

@ApiTags('Invites')
@Controller('api')
export class InvitesController {
  constructor(private readonly invites: InvitesService, private readonly messagingService: MessageService) { }

  @Get('users/:userId/invites')
  getUserInvites(@Param('userId') userId: string) {
    return this.invites.getUserInvites(userId);
  }

  @Post('invites')
  @ApiOperation({ summary: 'Create invite' })
  async create(@Body() dto: CreateInviteDto) {
    const invitation = await this.invites.create(dto);

    const vendorName = invitation.vendorName
    const finalSpecialty = invitation.specialty
    const generatedLink = `https://myVendors.name.ng/join/${invitation.token}`
    const phoneNumber = invitation.vendorPhone
    const text = `Hi${vendorName ? ` ${vendorName}` : ''}! Someone would like to add you to their list of trusted vendors on myVendors.\n\nPlease complete your details here:\n${generatedLink}\n\n${finalSpecialty ? `Their friends want them to refer a ${finalSpecialty}.` : ''}`
    this.messagingService.sendFromInternalService(text, phoneNumber)
    return invitation
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
