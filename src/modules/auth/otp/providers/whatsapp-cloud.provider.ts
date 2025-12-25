import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpProvider } from '../otp.provider';

@Injectable()
export class WhatsappCloudProvider implements OtpProvider {
  constructor(private configService: ConfigService) {}

  async sendOtp(phone: string, otp: string): Promise<void> {
    // Implementation for WhatsApp Cloud API
    const token = this.configService.get<string>('WHATSAPP_CLOUD_TOKEN');
    const phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');
    
    // TODO: Implement actual WhatsApp Cloud API call
    console.log(`[WHATSAPP CLOUD] Would send OTP ${otp} to ${phone}`);
  }
}