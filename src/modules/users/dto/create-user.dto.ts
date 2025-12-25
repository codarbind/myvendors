import { IsString, IsOptional, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class CreateUserDto {
  @ApiProperty({ 
    example: '+2348123456789', 
    description: 'Phone number in E.164 format' 
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { 
    message: 'Phone must be in E.164 format (e.g., +2348123456789)' 
  })
  phone: string;

  @ApiPropertyOptional({ 
    example: 'John Doe', 
    description: 'User full name (optional)' 
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;
}

