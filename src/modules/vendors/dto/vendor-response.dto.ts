import { ApiProperty } from '@nestjs/swagger';

export class VendorResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'Barber' })
  specialty: string;

  @ApiProperty({ example: '+2348123456789' })
  whatsapp: string;

  @ApiProperty({ example: '+2348123456789', required: false })
  phone?: string;

  @ApiProperty({ example: 'Lagos, Nigeria' })
  location: string;

  @ApiProperty({ example: '@johnbarber', required: false })
  instagram?: string;

  @ApiProperty({ example: 'john.barber', required: false })
  facebook?: string;

  @ApiProperty({ example: '@johnbarber', required: false })
  twitter?: string;

  @ApiProperty({ example: 'Professional barber with 10 years experience', required: false })
  description?: string;

  @ApiProperty({ example: ['https://example.com/photo1.jpg'], required: false })
  photos?: string[];

  @ApiProperty({ example: 'Highly recommended!', required: false })
  recommendationNote?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  addedBy: string;

  @ApiProperty({ example: 'Jane Smith' })
  addedByName: string;

  @ApiProperty({ example: 150 })
  viewCount: number;

  @ApiProperty({ example: 25 })
  shareCount: number;

  @ApiProperty({ example: true })
  isVisible: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;
}