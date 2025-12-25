import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  userId: string;

  @ApiProperty({ enum: ['invite_completed', 'vendor_listed'] })
  type: 'invite_completed' | 'vendor_listed';

  @ApiProperty({ example: 'Your invite has been completed!' })
  message: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013', required: false })
  vendorId?: string;

  @ApiProperty({ example: false })
  read: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;
}