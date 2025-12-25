import { IsString, IsOptional } from 'class-validator';

export class CreateInviteDto {
  @IsString()
  invitedBy: string;

  @IsString()
  invitedByName: string;

  @IsString()
  vendorPhone: string;

  @IsOptional()
  @IsString()
  vendorName?: string;

  @IsOptional()
  @IsString()
  specialty?: string;
}
