import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsResponseDto {
  @ApiProperty({ example: 100 })
  totalUsers: number;

  @ApiProperty({ example: 50 })
  totalVendors: number;

  @ApiProperty({ example: 45 })
  visibleVendors: number;

  @ApiProperty({ example: 200 })
  totalInvites: number;

  @ApiProperty({ example: 150 })
  completedInvites: number;

  @ApiProperty({ example: 0.75 })
  inviteCompletionRate: number;

  @ApiProperty({ example: 5000 })
  totalViews: number;

  @ApiProperty({ example: 1000 })
  totalShares: number;
}