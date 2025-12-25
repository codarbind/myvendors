import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchVendorDto {
  @ApiPropertyOptional({ example: 'barber' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 'Barber' })
  @IsOptional()
  @IsString()
  specialty?: string;
}