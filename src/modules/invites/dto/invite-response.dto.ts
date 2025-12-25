import { ApiProperty } from '@nestjs/swagger';

export class InviteResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  invitedBy: string;

  @ApiProperty({ example: 'Jane Smith' })
  invitedByName: string;

  @ApiProperty({ example: '+2348123456789' })
  vendorPhone: string;

  @ApiProperty({ example: 'John Barber', required: false })
  vendorName?: string;

  @ApiProperty({ example: 'Barber', required: false })
  specialty?: string;

  @ApiProperty({ example: 'abc123-def456-ghi789' })
  token: string;

  @ApiProperty({ example: false })
  verified: boolean;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  completedAt?: string;

  @ApiProperty({ example: false })
  deleted: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  deletedAt?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;
}