// src/message/dto/send-message.dto.ts
import { IsString, IsOptional, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class SendMessageDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  text?: string;

  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}