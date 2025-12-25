import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsString()
  specialty: string;

  @IsString()
  whatsapp: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  location: string;

  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() twitter?: string;
  @IsOptional() @IsString() description?: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsString()
  recommendationNote?: string;

  @IsString()
  addedBy: string;

  @IsString()
  addedByName: string;
}
