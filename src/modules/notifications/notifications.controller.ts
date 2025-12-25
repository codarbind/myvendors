import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('api/users/:userId/notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@Param('userId') userId: string) {
    return this.notifications.getUserNotifications(userId);
  }

  @Patch(':notificationId')
  markRead(@Param('notificationId') id: string) {
    return this.notifications.markRead(id);
  }

  @Patch('read-all')
  markAll(@Param('userId') userId: string) {
    return this.notifications.markAllRead(userId);
  }
}
