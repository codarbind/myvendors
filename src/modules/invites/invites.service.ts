import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InvitesRepository } from './invites.repository';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class InvitesService {
  constructor(private readonly repo: InvitesRepository) {}

  async create(dto: CreateInviteDto) {
    const token = randomUUID();

    return this.repo.create({
      ...dto,
      token,
    });
  }

  async getByToken(token: string) {
    const invite = await this.repo.findByToken(token);
    if (!invite) throw new NotFoundException('Invite not found');
    return invite;
  }

  getUserInvites(userId: string) {
    return this.repo.findByUser(userId);
  }

  async update(token: string, data: { verified?: boolean; vendorName?: string }) {
    const invite = await this.repo.findByToken(token);
    if (!invite) throw new NotFoundException('Invite not found');

    if (data.verified) {
      return this.repo.markVerified(token, data.vendorName);
    }

    return invite;
  }

  async complete(token: string) {
    const invite = await this.repo.findByToken(token);
    if (!invite) throw new NotFoundException('Invite not found');
    if (!invite.verified)
      throw new BadRequestException('Invite not verified');

    await this.repo.markCompleted(token);
    return { success: true };
  }

  delete(inviteId: string) {
    return this.repo.softDelete(inviteId);
  }

  canReinvite(userId: string, vendorPhone: string) {
    return this.repo.canReinvite(userId, vendorPhone);
  }
}
