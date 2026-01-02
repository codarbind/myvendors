// src/message/services/message.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { SendMessageResponse, MessagePayload } from './dtos/message.types';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { ThirdPartyService } from './thirdparty.service';


@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly thirdPartyService: ThirdPartyService) {}

  /**
   * Process and forward message to third party
   */
  async processAndForwardMessage(
    dto: SendMessageDto,
    media?: Express.Multer.File,
  ): Promise<SendMessageResponse> {
    try {
      // Validate payload
      this.validateMessagePayload(dto, media);
      
      // Prepare payload for third party
      const payload: MessagePayload = {
        text: dto.text,
        phoneNumber: dto.phoneNumber,
        media,
      };
      
      this.logger.log(`Processing message for ${dto.phoneNumber}`);
      
      // Send to third party
      const thirdPartyResponse = await this.thirdPartyService.sendMessage(payload);
      
      // Return combined response
      return {
        success: thirdPartyResponse.success,
        messageId: thirdPartyResponse.messageId,
        error: thirdPartyResponse.error,
        timestamp: new Date(),
        thirdPartyResponse,
      };
      
    } catch (error) {
      this.logger.error(`Message processing failed: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        `Message processing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Direct service call (for internal services)
   */
  async sendFromInternalService(
    text: string,
    phoneNumber: string,
    mediaBuffer?: Buffer,
    mediaMimeType?: string,
    mediaFileName?: string,
  ): Promise<SendMessageResponse> {
    let media: Express.Multer.File | undefined;
    
    if (mediaBuffer && mediaMimeType) {
      media = {
        fieldname: 'media',
        originalname: mediaFileName || 'file',
        encoding: '7bit',
        mimetype: mediaMimeType,
        buffer: mediaBuffer,
        size: mediaBuffer.length,
      } as Express.Multer.File;
    }
    
    const dto: SendMessageDto = {
      text,
      phoneNumber,
    };
    
    return this.processAndForwardMessage(dto, media);
  }

  /**
   * Validate message payload
   */
  private validateMessagePayload(dto: SendMessageDto, media?: Express.Multer.File): void {
    const { text, phoneNumber } = dto;
    
    // Check if we have at least text or media
    if (!text?.trim() && !media) {
      throw new HttpException(
        'Message must contain either text or media',
        HttpStatus.BAD_REQUEST,
      );
    }
    
    // Validate phone number format
    if (!this.isValidPhoneNumber(phoneNumber)) {
      throw new HttpException(
        'Invalid phone number format',
        HttpStatus.BAD_REQUEST,
      );
    }
    
    // Validate media if present
    if (media) {
      this.validateMedia(media);
    }
  }

  /**
   * Validate phone number
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic validation - adjust based on your needs
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phoneNumber) && phoneNumber.length >= 10;
  }

  /**
   * Validate media file
   */
  private validateMedia(media: Express.Multer.File): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'application/pdf',
    ];
    
    if (media.size > maxSize) {
      throw new HttpException(
        `File size too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
        HttpStatus.BAD_REQUEST,
      );
    }
    
    if (!allowedTypes.includes(media.mimetype)) {
      throw new HttpException(
        'Invalid file type. Allowed types: images (JPEG, PNG, GIF, WebP), videos (MP4, MPEG), PDF',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Check third party service health
   */
  async checkThirdPartyHealth(): Promise<boolean> {
    return this.thirdPartyService.checkHealth();
  }
}