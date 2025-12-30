// vendor-list.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsBoolean, IsOptional, IsString, Min } from 'class-validator';
import { Vendor } from '../schemas/vendor.schema';

export class VendorListDto {
  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 12, minimum: 1, maximum: 100 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  limit?: number = 12;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeHidden?: boolean = false;

  @ApiProperty({ required: false, description: 'Search query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, description: 'Filter by specialty' })
  @IsOptional()
  @IsString()
  specialty?: string;
}

export class VendorListResponseDto {
  @ApiProperty({ type: [Vendor] })
  vendors: Vendor[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}

