import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateInviteDto {
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsString()
  vendorName?: string;
}
