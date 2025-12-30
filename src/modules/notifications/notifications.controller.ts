import { Controller, Post, Param, Body, Get, Patch, Query} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { NotificationResponseDto, CreateNotificationDto, PaginatedNotificationsResponseDto, AdminListNotificationsDto } from "./dto/create-notification.dto";
import { NotificationsService } from "./notifications.service";

@ApiTags('Notifications')
@Controller('api/users/:userId/notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'user-123',
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  notifyUser(
    @Param('userId') userId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.notifications.notify(
      userId,
      dto.type,
      dto.message,
      dto.vendorId,
    );
  }
  
  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'user-123',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user notifications',
    type: [NotificationResponseDto],
  })
  list(@Param('userId') userId: string) {
    return this.notifications.getUserNotifications(userId);
  }


  
  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'user-123',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    type: ApiResponse,
  })
  markAll(@Param('userId') userId: string) {
    return this.notifications.markAllRead(userId);
  }

  @Patch(':notificationId')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'user-123',
  })
  @ApiParam({
    name: 'notificationId',
    description: 'Notification ID',
    example: 'notification-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  markRead(
    @Param('userId') userId: string,
    @Param('notificationId') id: string,
  ) {
    return this.notifications.markRead(id);
  }




  // Add admin endpoint (you might want to put this in a separate admin controller)
  @Get('admin/list')
  @ApiOperation({ summary: 'Admin endpoint: List all notifications with filtering and pagination' })
  @ApiQuery({ name: 'type', required: false, enum: ['invite_completed', 'vendor_listed'] })
  @ApiQuery({ name: 'read', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of notifications',
    type: PaginatedNotificationsResponseDto,
  })
  adminList(@Query() query: AdminListNotificationsDto) {
    const { type, read, page = 1, limit = 10 } = query;
    return this.notifications.adminList(
      { type, read },
      page,
      limit,
    );
  }
}