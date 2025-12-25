import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsPhoneNumber, IsInt, Min, IsDateString, IsArray } from 'class-validator';
import { ObjectIdDto, PhoneNumberDto, ISODateDto } from './primitives.dto';
import { VendorDto } from './vendor.dto';

export class UserResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '+2348123456789' })
  phone: string;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  nameUpdatedAt?: string;

  @ApiProperty({ example: 0 })
  pageViewCount: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;
}

///////////////





export class BaseUserDto {
  @ApiProperty({
    example: '694a8e0d0a7d823692b17a74',
    description: 'User unique identifier',
  })
  @IsMongoId()
  _id: ObjectIdDto;

  @ApiProperty({
    example: '+2348162750310',
    description: 'User phone number in E.164 format',
  })
  @IsPhoneNumber()
  phone: PhoneNumberDto;

  @ApiProperty({
    example: 0,
    description: 'Number of pages viewed by the user',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  pageViewCount: number;

  @ApiProperty({
    example: '2025-12-23T12:41:49.980Z',
    description: 'User creation timestamp (ISO 8601)',
  })
  @IsDateString()
  createdAt: ISODateDto;

  @ApiProperty({
    type: () => VendorDto,
    isArray: true,
    description: 'Vendors associated with the user',
  })
  @IsArray()
  @Type(() => VendorDto)
  vendors: VendorDto[];
}
