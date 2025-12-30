import { Controller, Get, Patch, Param, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsOptional, IsIn, IsNumber, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for creating a notification
export class CreateNotificationDto {
  @ApiProperty({
    description: 'Type of notification',
    enum: ['invite_completed', 'vendor_listed'],
  })
  @IsNotEmpty()
  @IsIn(['invite_completed', 'vendor_listed'])
  type: 'invite_completed' | 'vendor_listed';

  @ApiProperty({
    description: 'Notification message',
    example: 'Your invitation has been completed successfully',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Optional vendor ID',
    example: 'vendor-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorId?: string;
}

// DTO for admin listing
export class AdminListNotificationsDto {
  @ApiProperty({
    description: 'Filter by notification type',
    enum: ['invite_completed', 'vendor_listed'],
    required: false,
  })
  @IsOptional()
  @IsIn(['invite_completed', 'vendor_listed'])
  type?: 'invite_completed' | 'vendor_listed';

  @ApiProperty({
    description: 'Filter by read status',
    required: false,
  })
  @IsOptional()
  read?: boolean;

  @ApiProperty({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 20,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

// DTO for notification response
export class NotificationResponseDto {
  @ApiProperty({
    description: 'Notification ID',
    example: 'notification-123',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  userId: string;

  @ApiProperty({
    description: 'Notification type',
    enum: ['invite_completed', 'vendor_listed'],
  })
  type: 'invite_completed' | 'vendor_listed';

  @ApiProperty({
    description: 'Notification message',
    example: 'Your invitation has been completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Optional vendor ID',
    example: 'vendor-123',
    required: false,
  })
  vendorId?: string;

  @ApiProperty({
    description: 'Read status',
    example: false,
  })
  read: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

// DTO for paginated response
export class PaginatedNotificationsResponseDto {
  @ApiProperty({
    description: 'List of notifications',
    type: [NotificationResponseDto],
  })
  data: NotificationResponseDto[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}

