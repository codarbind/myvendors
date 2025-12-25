import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './repositories/notifications.repository';



@Injectable()
export class NotificationsService {
  constructor(private readonly repo: NotificationsRepository) {}

  notify(
    userId: string,
    type: 'invite_completed' | 'vendor_listed',
    message: string,
    vendorId?: string,
  ) {
    return this.repo.create({ userId, type, message, vendorId });
  }

  getUserNotifications(userId: string) {
    return this.repo.findByUser(userId);
  }

  markRead(id: string) {
    return this.repo.markRead(id);
  }

  markAllRead(userId: string) {
    return this.repo.markAllRead(userId);
  }

  adminList(filter: any, page: number, limit: number) {
    return this.repo.adminList(filter, page, limit);
  }
}
