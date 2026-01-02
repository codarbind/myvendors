import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpProvider } from '../otp.provider';
import { MessageService } from 'src/modules/messagings/message.service';
import { removePlus } from 'src/common/utils/formatter';

@Injectable()
export class WhatsappCloudProvider implements OtpProvider {

  private readonly logger = new Logger(WhatsappCloudProvider.name);

  constructor(private readonly messageService: MessageService) { }

  async sendOtp(phone: string, otp: string): Promise<void> {
    try {
      this.logger.log(`[MOCK OTP] Sending OTP ${otp} to ${phone}`);

      // Create OTP message with template
      const otpMessage = this.formatOtpMessage(otp, 'myVendors ');

      // Call messaging service to send OTP via third party
      const result = await this.messageService.sendFromInternalService(
        otpMessage,
        removePlus(phone),
      );

      if (result.success) {
        this.logger.log(`OTP sent successfully to ${phone}. Message ID: ${result.messageId}`);
        // Also log to console for development
        console.log(`[DEV MODE] Your OTP is: ${otp}`);
        console.log(`[DEV MODE] OTP was also sent via messaging service to: ${phone}`);
      } else {
        this.logger.warn(`Failed to send OTP via messaging service: ${result.error}`);
        // Fallback to console log
        console.log(`[FALLBACK] Your OTP is: ${otp}`);
      }

    } catch (error) {
      this.logger.error(`Error sending OTP to ${phone}:`, error.message);

      // Fallback - always log OTP to console in development
      console.log(`[ERROR FALLBACK] Your OTP is: ${otp}`);
      console.log(`[ERROR FALLBACK] OTP was meant for: ${phone}`);

      // You can choose to rethrow or just log, depending on your requirements
      // throw error;
    }
  }

  /**
   * Format OTP message with a nice template
   */
  private formatOtpMessage(otp: string, brandName: string = ''): string {
    // You can customize this template
    return `Your ${brandName}verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nDo not share this code with anyone.`;
  }

  /**
   * Optional: Send OTP with branding/media
   */
  async sendOtpWithBranding(phone: string, otp: string, brandName: string): Promise<void> {
    try {
      const otpMessage = `Your ${brandName} verification code is: ${otp}\n\nThis code expires in 10 minutes.`;

      const result = await this.messageService.sendFromInternalService(
        otpMessage,
        phone,
      );

      this.logger.log(`Branded OTP sent to ${phone} for ${brandName}`);

    } catch (error) {
      this.logger.error(`Failed to send branded OTP: ${error.message}`);
      // Fallback to basic OTP
      await this.sendOtp(phone, otp);
    }
  }

  /**
   * Optional: Send OTP with media (logo/image)
   */
  async sendOtpWithMedia(
    phone: string,
    otp: string,
    mediaBuffer?: Buffer,
    mediaType?: string,
  ): Promise<void> {
    try {
      const otpMessage = `Your verification code is: ${otp}\n\nUse this code to complete your verification.`;

      const result = await this.messageService.sendFromInternalService(
        otpMessage,
        phone,
        mediaBuffer,
        mediaType,
        'otp-verification.jpg',
      );

      this.logger.log(`OTP with media sent to ${phone}`);

    } catch (error) {
      this.logger.error(`Failed to send OTP with media: ${error.message}`);
      // Fallback to basic OTP without media
      await this.sendOtp(phone, otp);
    }
  }
}