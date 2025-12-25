import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ enum: ['invite_completed', 'vendor_listed'] })
  @IsEnum(['invite_completed', 'vendor_listed'])
  type: 'invite_completed' | 'vendor_listed';

  @ApiProperty({ example: 'Your invite has been completed!' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  vendorId?: string;
}