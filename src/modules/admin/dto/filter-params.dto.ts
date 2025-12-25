import { IsOptional, IsString, IsEnum, IsBooleanString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterParamsDto {
  @ApiPropertyOptional({ example: 'barber' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'Barber' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({ example: 'true' })
  @IsOptional()
  @IsBooleanString()
  visibility?: string;

  @ApiPropertyOptional({ example: 'sent' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'invite_completed' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'false' })
  @IsOptional()
  @IsBooleanString()
  read?: string;
}